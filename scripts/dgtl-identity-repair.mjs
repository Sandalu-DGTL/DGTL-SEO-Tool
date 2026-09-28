import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Never choose between two live subjects, or migrate by email alone.
export function planIdentityRepair(links, identities) {
  if (
    links.length === 0 ||
    new Set(links.map((x) => x.account_id)).size !== links.length
  )
    return null;
  if (links.every((x) => identities.get(x.account_id)?.state === "deleted")) {
    return { keep: null, retire: links };
  }
  const live = links.filter(
    (x) => identities.get(x.account_id)?.state === "live",
  );
  if (live.length !== 1) return null;
  const identity = identities.get(live[0].account_id);
  if (
    !identity.verified ||
    identity.email.toLowerCase() !== live[0].email.toLowerCase()
  )
    return null;
  const obsolete = links.filter((x) => x !== live[0]);
  if (!obsolete.length) return null;
  if (obsolete.some((x) => identities.get(x.account_id)?.state !== "deleted"))
    return null;
  return { keep: live[0], retire: obsolete };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const root = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (root !== "https://tzrvssbpkcdfovrualxm.supabase.co" || !secret) {
    throw new Error(
      "Provide the production Supabase URL and server secret via environment, never CLI arguments.",
    );
  }
  const query = (sql) =>
    JSON.parse(
      execFileSync(
        "./node_modules/.bin/wrangler",
        [
          "d1",
          "execute",
          "df07bf2f-bce0-4d9f-9f94-cd8c52064492",
          "--remote",
          "--json",
          "--command",
          sql,
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ),
    );
  const results = query(`SELECT a.user_id,u.email,a.account_id FROM account a
    JOIN user u ON u.id=a.user_id WHERE a.provider_id='dgtl-sso'`);
  const groups = Map.groupBy(
    results.flatMap((x) => x.results),
    (x) => x.user_id,
  );
  let repaired = 0;
  let blocked = 0;
  for (const links of groups.values()) {
    const identities = new Map();
    for (const link of links) {
      const response = await fetch(
        `${root}/auth/v1/admin/users/${encodeURIComponent(link.account_id)}`,
        {
          headers: { apikey: secret, Authorization: `Bearer ${secret}` },
          signal: AbortSignal.timeout(10000),
        },
      );
      const data = await response.json();
      identities.set(
        link.account_id,
        response.status === 404 && data.error_code === "user_not_found"
          ? { state: "deleted" }
          : response.ok &&
              data.id === link.account_id &&
              typeof data.email === "string"
            ? {
                state: "live",
                email: data.email,
                verified: !!data.email_confirmed_at,
              }
            : { state: "unknown" },
      );
    }
    const plan = planIdentityRepair(links, identities);
    if (!plan) {
      if (
        links.length !== 1 ||
        identities.get(links[0].account_id)?.state !== "live"
      )
        blocked++;
      continue;
    }
    if (apply) {
      const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
      const userId = links[0].user_id;
      // One atomic statement; refuse if the link set changed since inspection.
      const updates = query(`UPDATE account SET provider_id='dgtl-sso-retired'
        WHERE user_id=${quote(userId)} AND provider_id='dgtl-sso'
        AND account_id IN (${plan.retire.map((x) => quote(x.account_id)).join(",")})
        AND (SELECT COUNT(*) FROM account WHERE user_id=${quote(userId)} AND provider_id='dgtl-sso')=${links.length}
        ${plan.keep ? `AND EXISTS (SELECT 1 FROM account WHERE user_id=${quote(userId)} AND provider_id='dgtl-sso' AND account_id=${quote(plan.keep.account_id)})` : ""}`);
      if (
        updates.reduce((total, result) => total + result.meta.changes, 0) !==
        plan.retire.length
      ) {
        throw new Error("Concurrent identity change; rerun audit.");
      }
    }
    repaired++;
  }
  console.log(
    JSON.stringify({
      mode: apply ? "apply" : "dry-run",
      repairableAccounts: repaired,
      requiresReview: blocked,
    }),
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch(() => {
    console.error(
      "Identity audit failed. No credentials or upstream responses are logged.",
    );
    process.exitCode = 1;
  });
}
