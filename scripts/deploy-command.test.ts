import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const { scripts } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { scripts: Record<string, string> };

describe("production deployment command", () => {
  it("builds successfully before deploying the audit worker and then the app", () => {
    expect(scripts.deploy.split(" && ")).toEqual([
      "npm run build",
      "wrangler deploy -c dist/ceo_dgtl_audit/wrangler.json",
      "wrangler deploy -c dist/server/wrangler.json",
    ]);
  });

  it("keeps production database migration a separate deliberate command", () => {
    expect(scripts.deploy).not.toMatch(/migrat|--remote/);
    expect(scripts["db:migrate:prod"]).toBe(
      "wrangler d1 migrations apply DB --remote",
    );
  });
});
