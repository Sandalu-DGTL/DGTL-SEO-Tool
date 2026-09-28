# Service Hub access and legacy identity repair

Service Hub's SEO card must enter `/sso`, not a saved `/p/<project>` URL.
The entry starts a fresh central OAuth handoff, replacing the previous SEO
session. Verified active users with SEO assigned may sign up automatically.
New users complete onboarding; returning users open a project selected from
their own authorized workspace. Authentication does not grant another client's
projects, and suspended or explicitly disabled clients remain denied.

Legacy databases may contain several central subjects for one SEO user after
central users were deleted and recreated. Runtime access deliberately rejects
ambiguous identities; do not remove that check or select the first account row.

Run the account-wide maintenance tool from the SEO repository with Node 22+:

```sh
node --env-file=/secure/path/backend.env scripts/dgtl-identity-repair.mjs
node --env-file=/secure/path/backend.env scripts/dgtl-identity-repair.mjs --apply
node --test scripts/dgtl-identity-repair.test.mjs
```

The environment must supply `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. Never add
the server secret to browser variables or commit it. Wrangler requires access
to the production D1 database. This tool is intentionally pinned to DGTL's
production Supabase project and D1 database to prevent cross-environment repairs.

Dry-run is the default. The audit includes single links, not just duplicates.
If every linked subject is confirmed deleted, all obsolete links can be retired.
This does not create a session or grant access: the next verified central login
must still satisfy Better Auth's verified-local-email policy and SEO entitlement.
Otherwise, application is allowed only when exactly one linked
subject still exists with a verified matching email and every other subject
is explicitly `user_not_found` in Supabase. Outages, conflicting live subjects,
unverified identities, and mismatched emails require manual review. The tool
does not change entitlements, users, memberships, projects, or tokens.

Retired rows remain recoverable with provider `dgtl-sso-retired`; any reversal
must be reviewed because restoring conflicting rows makes access ambiguous.
Account creation also rejects a second central identity in the runtime code.
That guard is not a substitute for a database uniqueness constraint under
concurrent requests. Do not delete/recreate central users to reset passwords.
This is an operator-run migration, not automatic runtime reconciliation. Future
central-user deletion/recreation requires another audit or a separately designed
trusted lifecycle integration; do not claim that this maintenance tool provides it.

After a repair, test two separate accounts through Service Hub → SEO, including
switching accounts in the same browser, and verify workspace isolation. A
successful database audit alone does not establish end-to-end login success.
