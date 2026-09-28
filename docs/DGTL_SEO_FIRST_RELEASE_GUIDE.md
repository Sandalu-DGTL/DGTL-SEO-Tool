# DGTL SEO: first-release guide

Prepared: 28 September 2026. Scope: SEO only, using the existing central DGTL login. CMS, HR and CRM are separate releases.

## 1. What are we releasing?

A client signs in once, chooses SEO, and can use SEO tools with their own data. They must never see another client's projects.

```text
DGTL login: Google or email/password
                  |
                  v
My services at auth.dgtl.lk/user
                  |
             Click Open SEO
                  |
                  v
SEO SSO: verify central identity and SEO entitlement
                  |
         +--------+---------+
         |                  |
    New SEO user       Returning SEO user
         |                  |
    Own workspace      Existing authorized projects
         |                  |
    Onboarding once         |
         +--------+---------+
                  |
                  v
          Own SEO dashboard
                  |
             SEO-only logout
                  |
                  v
My services; central DGTL login remains active
```

Authentication answers “who is this?”. Tool access and project membership answer “what may this person use?”. Both checks must remain enabled. Removing permission checks is not a fix for an access error.

## 2. Current situation

The following is a snapshot, not a guarantee that every feature works:

| Area                  | Evidence and remaining work                                                                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository            | `Sandalu-DGTL/DGTL-SEO-Tool`, local branch `dev-seo`, latest local commit `9b30389`.                                                                                                                                                                                               |
| Local changes         | Auth, identity, dependency, styling and documentation changes are uncommitted. Review them before choosing a release commit. Do not overwrite them or blindly commit everything.                                                                                                   |
| Production            | SEO homepage returned HTTP 200 during the latest check. The latest observed Worker deployment was `f6628fce-5575-4133-852e-f57863450750`, deployed 28 September 2026.                                                                                                              |
| New-user provisioning | A production aggregate check found eight users created after the 25 September auth release: eight had workspace membership and DGTL identity links; seven had completed onboarding. This demonstrates successful provisioning for some accounts, not universal end-to-end success. |
| Dashboard             | The overview includes explicitly labelled sample figures. It must not be presented as a client's live analytics.                                                                                                                                                                   |
| Credentials           | SSO, DataForSEO, Google and OpenRouter secret names were present on the Worker. This does not establish that their values, permissions, balances or all integrations work.                                                                                                         |
| Release readiness     | A complete, recorded first-release acceptance test is still required.                                                                                                                                                                                                              |

Production deployment IDs and Git commits are different identifiers. Record their mapping when deploying; do not infer that the current dirty working tree exactly matches production.

## 3. Keep the first release small

Proposed release scope, to confirm before implementation:

- Central login, My services handoff, account isolation and SEO-only logout.
- New-user onboarding and returning-user project selection.
- Project creation and an honest project dashboard, using real data or clear empty states.
- Keyword research and saved keywords.
- Site audit with a visible running/completed/failed state.
- Google Search Console connection and insights if its configuration and tests pass.

Rank tracking, backlinks, GA4, AI reports/chat and MCP may be included only after their own tests pass. Otherwise clearly mark them unavailable or keep them out of the first-release navigation. Do not silently leave nonworking buttons accessible. Agree on any feature removal before changing code.

Existing billing and credit checks need testing even if selling subscriptions is not part of this release. They may already control access to tools.

## 4. A to Z: complete these in order

These are pending release checklist items, not claims of completion.

### Phase 1: establish the release source

- [ ] **A — Agree on scope.** Choose the features in section 3. Defer CMS, HR and CRM integration.
- [ ] **B — Review `dev-seo`.** Inspect all modified and untracked files. Identify which changes belong in the release. Preserve unrelated work.
- [ ] **C — Establish recovery.** Record the current Worker version and database bindings. Verify D1 backup/restore arrangements before schema or identity changes. Keep a known-good application version available.

Exit condition: the developer can identify exactly what code will be tested and how to recover.

### Phase 2: finish the login and client journey

- [ ] **D — Verify central login.** Test Google and email/password through Supabase. Check email verification, password reset and failed-login messages. Passwords and privileged Supabase keys must never be stored in application logs or source code.
- [ ] **E — Land on My services first.** Successful central login must show `https://auth.dgtl.lk/user`, not force SEO onboarding before the client chooses SEO.
- [ ] **F — Start SEO SSO from the tool card.** Use the SEO `/sso` entry, not one person's hard-coded project URL. Verify the callback and central access check.
- [ ] **G — Resolve identity safely.** Use the verified central subject, not email alone, to identify the account. Handle new identities separately. Preserve existing projects; historical identity conflicts require reviewed repair, not blind merging.
- [ ] **H — Finish routing and logout.** New users get their own workspace and onboarding once. Returning users get an authorized project. SEO logout clears SEO's session and returns to My services without logging out central DGTL.

Exit condition: the login test cases in section 6 pass, including switching between two different accounts.

### Phase 3: make the selected tools genuinely usable

- [ ] **I — Validate DataForSEO.** Confirm the API credential works, the account has funds, and one small agreed request returns real results. Set spending limits and monitor usage. Provider requests may cost money.
- [ ] **J — Test keyword research.** Search a real keyword, change country/language, paginate, save a keyword and reload it. Check zero-result and provider-error states.
- [ ] **K — Test site audit.** Audit an authorized test website. Verify audit Worker bindings, job execution, stored results and failure recovery. Check that user-supplied URLs cannot access private/internal network resources.
- [ ] **L — Connect Search Console.** Configure Google's application callback and scopes, then connect a property the test user can access. Select the property and verify a real date range. Google account access does not automatically grant Search Console property access.
- [ ] **M — Test other included services.** For rank tracking, confirm a scheduled run stores results. For backlinks, verify a real domain response. For GA4, connect a property. For AI, test generation, failure handling and cost limits. Defer anything that cannot pass.

Exit condition: every feature advertised in the release has a real successful request, saved result where applicable, and a usable failure state.

### Phase 4: prepare the product for clients

- [ ] **N — Replace sample dashboard claims.** Connect released dashboard cards to actual project data. Show the source and date range. If no source is connected, show “Connect your data source” or “No data yet”, not invented scores.
- [ ] **O — Confirm access and credit rules.** An active, entitled client must reach the included tools. Suspended or unassigned clients must not. Test the existing Autumn/credit gates, insufficient credits and provider charging behavior. Decide commercial rules explicitly.
- [ ] **P — Check usability.** Test desktop/mobile layouts, loading states, keyboard navigation, form validation, empty projects and clear recovery actions. Do not display a raw generic access error as the only explanation.
- [ ] **Q — Check security.** Validate tokens and callback destinations; protect secrets; enforce server-side membership on every project request. Review rate limits and sensitive logging. Test denial paths, not just successful logins.

Exit condition: clients understand their data and errors, and cannot access another client's records.

### Phase 5: prove readiness

- [ ] **R — Run automated checks.** Run the commands below on the proposed release source. Investigate failures; do not bypass checks simply to deploy.
- [ ] **S — Run end-to-end acceptance tests.** Complete section 6 with dedicated accounts. Record the release commit, environment, expected result and actual result.
- [ ] **T — Check performance.** Measure login-to-dashboard and included tool response times with realistic data. Review slow queries and large payloads. Define acceptable targets before claiming high performance.
- [ ] **U — Add operational visibility.** Capture request IDs and safe denial categories in logs. Set up error and spending alerts. Never log passwords, access tokens or complete OAuth callback URLs containing authorization codes.

Exit condition: all critical tests pass and the team can identify where a future failure occurs.

### Phase 6: publish a controlled first release

- [ ] **V — Prepare a release record.** Commit reviewed code to the intended branch, choose a release tag/version, record configuration names and write short release notes. Do not commit secret values.
- [ ] **W — Deploy the tested artifact.** Verify Cloudflare account, Worker, domain, D1 and dependent audit Worker targets. Apply only required reviewed migrations, with a recovery plan. Deploy in dependency order.
- [ ] **X — Run production smoke tests.** Repeat fresh-user, returning-user, account-switch, logout and one real request for each included tool. A successful build or homepage HTTP 200 is not enough.
- [ ] **Y — Pilot with a small client group.** Watch real errors, failed jobs, provider costs and client feedback. Resolve critical issues before a broader announcement.
- [ ] **Z — Approve release.** Publish only when acceptance criteria pass. Record known limitations, support contact and rollback instructions. Continue monitoring after launch.

## 5. Configuration checklist: where each setting belongs

Never send passwords, client secrets or service-role keys in chat. Enter them in the appropriate secret manager. Public client IDs are not equivalent to client secrets.

| System                               | What to check                                                                                                                                    | Who handles it                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Supabase central authentication      | Google and email/password providers, verification/reset URLs, OAuth app registration, exact SEO callback, active users                           | Central auth maintainer                 |
| DGTL auth frontend on Vercel         | Production backend `API_URL=https://api.dgtl.lk/v1`, deployed consent handler, successful login lands on My services                             | Central frontend maintainer             |
| DGTL backend                         | Verified identity response, active/suspended status and correct SEO service assignments                                                          | Backend maintainer                      |
| SEO Worker                           | Hosted auth mode, SSO client ID and secret, trusted issuer/discovery URL, central access-check URL, correct production origin and redirect flags | SEO maintainer                          |
| Better Auth                          | Strong server-side secret, correct production base URL and trusted origins, working session storage                                              | SEO maintainer                          |
| D1 and Cloudflare bindings           | Correct production DB, expected migrations, audit Worker/workflow bindings, scheduled jobs and required KV bindings                              | SEO maintainer                          |
| DataForSEO                           | `DATAFORSEO_API_KEY`, correct documented encoding, account balance, limits and actual request success                                            | Account owner + SEO maintainer          |
| Google GSC/GA4                       | Client ID/secret, callback URIs, APIs/scopes, consent-screen availability, per-client property permissions and connection                        | Account owner + SEO maintainer + client |
| OpenRouter, if AI is included        | Secret, permitted models, balance, generation limits and usage monitoring                                                                        | Account owner + SEO maintainer          |
| Autumn/access credits                | Required credentials/settings, intended plan or managed access, feature identifiers, credit balance and charging checks                          | Product owner + SEO maintainer          |
| Turnstile, if used in released flows | Valid site/secret pair, allowed production hostname and accessible failure state                                                                 | SEO maintainer                          |
| Optional email/analytics             | Configure only released functionality; document consent/privacy needs and ensure failures do not block core SEO access                           | Product owner + SEO maintainer          |

Inspect actual variable names in the repository before entering settings. Do not invent new names or overwrite existing production values just because this checklist mentions a service. See the setup guides linked below.

## 6. First-release acceptance tests

| Test                                  | Required result                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| Fresh Google account                  | Central login -> My services -> Open SEO -> own onboarding -> own dashboard          |
| Fresh email/password account          | Same result after required email verification; no second SEO registration            |
| Returning account                     | Open SEO -> own dashboard without repeated onboarding                                |
| Reload after completing onboarding    | Completion persists and own dashboard remains accessible                             |
| SEO-only logout                       | Returns to My services; central session remains active                               |
| Switch central account A to B         | Open SEO establishes B's identity; A's cached projects or session cannot leak into B |
| Manually open A's project URL as B    | Access denied; no project data returned                                              |
| New user with no project data         | Usable setup/empty state, not sample data presented as real                          |
| Expired login                         | Safe reauthentication without an infinite redirect loop                              |
| Suspended or unassigned user          | Tool access denied clearly; no automatic privilege grant                             |
| Provider outage / insufficient credit | Honest actionable error, no false success or uncontrolled retries                    |
| Keyword research                      | Real results, saved keyword persists and is scoped to the correct project            |
| Site audit                            | Authorized site job completes; results persist; failures are recoverable             |
| Search Console, if included           | Authorized property, expected dates and real results; disconnect is handled          |
| Other included tools                  | One successful real workflow and one failure case for each                           |

Use dedicated test accounts. Do not create, merge, transfer or erase real client data merely to make a test pass.

If “You do not have access to this resource” returns, capture the failing request's request ID and safe server denial category. Check central identity, SEO identity mapping, active workspace membership and requested project ownership in that order. Do not assume clearing cookies or redeploying will fix it.

## 7. Developer commands and deployment warning

From the repository root, run the existing checks:

```bash
pnpm install --frozen-lockfile
pnpm run types:check
pnpm test
pnpm run lint
pnpm run build
pnpm run test:e2e
```

Tests may require environment setup and a running application. Follow their configuration and the local development guide. A local no-auth session cannot prove production SSO works.

For local development after configuring the development environment and local database:

```bash
pnpm run db:migrate:local
pnpm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Do not use `local_noauth` for an internet-facing production deployment.

The release preparation pass corrected `pnpm run deploy` to build first, then deploy `dist/ceo_dgtl_audit/wrangler.json` and `dist/server/wrangler.json`. It no longer applies production database migrations automatically. Any required `pnpm run db:migrate:prod` is a separate reviewed operation with a recovery plan. Confirm hosted build flags, generated configuration and intended targets before deploying.

Use a tested hosted production build with the intended SSO flags. Confirm secrets/bindings are preserved and record the deployed version. Rolling back Worker code does not roll back database migrations or identity mutations.

## 8. What should we do first, right now?

1. Confirm the first-release feature list in section 3.
2. Review and reconcile the uncommitted `dev-seo` changes with the deployed release. This establishes a reproducible source baseline.
3. Run the login/account-isolation tests before further UI polishing.
4. Verify DataForSEO and audit requests; connect a real Search Console property if included.
5. Finish the dashboard with real data or honest empty states.
6. Run the complete checks, deploy the tested release, and pilot it with a small group.

The owner provides feature choices, provider accounts/budget, a test website/property and test users. The developer handles code review, configuration verification, tests, deployment and recovery. Clients connect only their own data sources.

The release is blocked by any account leak, unexplained login failure, lost project ownership, repeat-onboarding bug, broken advertised core feature or unsafe production configuration. Cosmetic improvements can follow once those blockers are resolved.

## 9. Further documentation

- [Technology stack and project introduction](./DGTL_PROJECT_TECHNOLOGY_GUIDE.md)
- [DGTL SSO setup](./DGTL_SSO_SETUP.md)
- [Fresh central identities and account isolation](./DGTL_FRESH_ACCOUNTS.md)
- [Identity repair: read before any maintenance operation](./DGTL_IDENTITY_REPAIR.md)
- [Local development](./LOCAL_DEVELOPMENT.md)
- [Architecture and folders](./ARCHITECTURE_AND_FOLDERS.md)
- [DataForSEO credentials](./DATAFORSEO_API_KEY.md)
- [Google Search Console configuration](./SELF_HOSTING_GOOGLE_SEARCH_CONSOLE.md)
- [Google Analytics configuration](./SELF_HOSTING_GOOGLE_ANALYTICS.md)

Some historical documents describe earlier deployments or migration stages. Verify their instructions against the selected release code and current configuration before making production changes.
