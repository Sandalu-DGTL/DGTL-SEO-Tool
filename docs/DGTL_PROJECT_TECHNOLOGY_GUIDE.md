# DGTL SEO Tool: Project Introduction and Technology Guide

Documentation snapshot: 28 September 2026.

This guide describes the local repository inspected on this date. Package versions below are declarations in package manifests, not a claim about the exact packages running in production. The lockfiles record resolved versions. Production services and credentials were not tested for this documentation task.

## 1. Project introduction

DGTL SEO Tool is a web application for managing search-engine optimization work for websites. It includes keyword research, domain and backlink analysis, rank tracking, site audits, Google search and analytics integrations, project reports, and AI-assisted workflows.

The repository is a DGTL-customized OpenSEO codebase. Some source names, package names, documentation, and interface text still use OpenSEO. The root package is named `open-seo`, with application version `0.1.9`. The repository contains an MIT license with the upstream copyright notice; preserve that notice when distributing the software.

The main application is a full-stack TypeScript project. Its React interface and TanStack Start server functions run as a Cloudflare Workers application. The central DGTL login hub is a separate project.

| Item                                     | Value at inspection                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Repository                               | `Sandalu-DGTL/DGTL-SEO-Tool`                                                        |
| Local branch                             | `dev-seo`                                                                           |
| Latest local commit                      | `9b30389` - `style: apply DGTL design system to SEO workspace`                      |
| Main application domain                  | `seo.dgtl.lk`                                                                       |
| Main Worker configuration name           | `ceo-dgtl`                                                                          |
| Separate audit Worker configuration name | `ceo-dgtl-audit`                                                                    |
| Default local port                       | `3001`                                                                              |
| Package manager                          | `pnpm@10.30.1`                                                                      |
| Working tree                             | Contains uncommitted authentication, styling, dependency, and documentation changes |

The commit and working tree describe local code only. They do not identify the current production release.

## 2. Separate projects in the DGTL platform

| Project or service   | Responsibility                                                                                      | Technology and hosting                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| DGTL SEO Tool        | SEO interface, application sessions, workspaces, projects, SEO services                             | React, TanStack Start, Cloudflare Workers, D1 by default                                  |
| DGTL-Service         | Central login interface and My services hub                                                         | Next.js on Vercel, based on the earlier project inspection                                |
| DGTL-Service-Backend | Central client profile, status, and tool assignments                                                | NestJS API on Vercel; Supabase authentication and PostgreSQL, based on earlier inspection |
| Supabase Auth        | Central user identities and Google/email-password authentication; OAuth identity provider for tools | Managed Supabase service                                                                  |
| CMS, HR, CRM         | Independent business applications developed separately                                              | Their codebases and complete technology stacks have not been inspected                    |

The previously identified central branches are `dev-sandalu`. This task did not recheck those repositories' deployment branches.

Sharing a central login does not require merging these codebases or sharing project data. Each tool must validate the central identity and apply its own permissions. The SEO application's database is not the same thing as the central Supabase authentication database.

## 3. Product areas

These modules exist in the source. Their presence does not prove that production credentials, permissions, quotas, and subscriptions are configured.

| Area                  | Purpose                                           | Main source location                                               |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| Dashboard             | Project overview and performance summaries        | `src/client/features/dashboard/`, `src/server/features/dashboard/` |
| Keyword research      | Discover, review, save, and organize search terms | `src/server/features/keywords/`                                    |
| Domain research       | Review domains and competitors                    | `src/server/features/domain/`                                      |
| Backlinks             | Analyze incoming links and referring domains      | `src/server/features/backlinks/`                                   |
| Rank tracking         | Store tracked keywords and run scheduled checks   | `src/server/features/rank-tracking/`                               |
| Site audits           | Crawl pages and report technical SEO issues       | `src/server/features/audit/`, `src/server/lib/audit/`              |
| Lighthouse            | Process performance and quality audit results     | `src/server/features/lighthouse/`                                  |
| Google Search Console | Work with connected search-performance properties | `src/server/features/gsc/`                                         |
| Google Analytics 4    | Work with connected analytics properties          | `src/server/features/ga4/`                                         |
| AI search             | AI-related research features                      | `src/server/features/ai-search/`                                   |
| SAM assistant         | In-app AI conversation and tool execution         | `src/server/features/sam/`                                         |
| Reports               | Generate and manage project reports               | `src/server/features/reports/`                                     |
| Onboarding            | Record initial setup and completion               | `src/server/features/onboarding/`                                  |
| Project context       | Store project information used by workflows       | `src/server/features/project-context/`                             |
| Clarity page          | Project-level Clarity interface                   | `src/routes/_project/p/$projectId/clarity.tsx`                     |
| MCP                   | Expose authorized SEO operations to AI clients    | `src/server/mcp/`                                                  |

The Clarity route exists, but this inspection does not establish a working Microsoft Clarity data connection. A visible page or demo metric is not evidence of live provider data.

## 4. Main application technology stack

### Frontend

| Technology                  | Declared version     | Role                                                  |
| --------------------------- | -------------------- | ----------------------------------------------------- |
| TypeScript                  | `^5.9.3`             | Typed application and tooling code                    |
| React / React DOM           | `^19.0.0`            | Interface components and rendering                    |
| TanStack Start              | `^1.168.26`          | Full-stack application framework and server functions |
| TanStack Router             | `^1.170.16`          | File-based routes, navigation, route data             |
| TanStack Query              | `^5.101.2`           | Server-state fetching, caching, invalidation          |
| TanStack Form               | `^1.33.0`            | Form state and submission workflows                   |
| TanStack Table              | `^8.21.3`            | Data tables for SEO results                           |
| Tailwind CSS                | `^4.1.16`            | Utility-based styling                                 |
| DaisyUI                     | `^5.5.5`             | UI styles and component classes                       |
| Lucide React                | `^0.542.0`           | Icons                                                 |
| Recharts                    | `^3.7.0`             | Charts                                                |
| Sonner                      | `^2.0.7`             | Toast notifications                                   |
| React Markdown / remark-gfm | `^10.1.0` / `^4.0.1` | Markdown and GitHub-flavored Markdown rendering       |

The main SEO application does not use Next.js. Next.js belongs to the separate central login frontend. A folder named `tanstack-db` exists in the client source, but the root manifest does not declare the TanStack DB package; do not infer an installed framework from that folder name.

### Server and validation

TanStack Start server functions connect the UI to TypeScript services. The preferred project structure is server function, then service, then repository. Repositories perform database operations. Zod validates untrusted inputs and provider responses.

Cloudflare Workers runs production request handlers. Node.js runs development tools, tests, and maintenance scripts; the main hosted request runtime is Workers, not a dedicated Express or NestJS process.

Supporting libraries include `better-call` for endpoint infrastructure, `jose` for JWT-related verification, `remeda` for data transformations, and parsers for CSV, XML, HTML, YAML, robots rules, and domain names. The complete direct-dependency inventory is at the end of this document.

### Database and storage

| Technology                        | Use and configuration status                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Cloudflare D1 / SQLite            | Default SEO application database; configuration names it `dgtl-seo`                                     |
| Drizzle ORM                       | Typed queries and schema definitions                                                                    |
| Drizzle Kit                       | Generate and manage database migrations                                                                 |
| PostgreSQL with `postgres` driver | Optional SEO database backend selected through `DATABASE_PROVIDER=postgres`                             |
| Cloudflare Hyperdrive             | Optional connection binding for PostgreSQL                                                              |
| Cloudflare KV                     | Key-value bindings, including `KV` and `OAUTH_KV`                                                       |
| Cloudflare Durable Objects        | Stateful SAM chat and audit scratchpad components                                                       |
| Cloudflare R2                     | Object-storage support exists; the checked-in main Worker config says its R2 binding is not enabled yet |
| libSQL client                     | Development dependency; do not confuse it with the default production database                          |

SQLite and PostgreSQL have separate schema/migration files. Changes need compatibility checks for both. The database selection code lives in `src/db/index.ts`; it defaults to D1.

### Background work and hosting

Cloudflare Workflows supports site-audit and rank-check jobs. Audits run in a separate Worker to isolate their workload. The main Worker has a service binding to the audit engine. Cron triggers are configured at five-minute intervals and daily at `03:17` UTC; inspect `src/server.ts` for the jobs they dispatch.

Wrangler builds/deploys and manages Cloudflare resources. Alchemy configuration supports infrastructure workflows, including alternative deployment paths. Docker and Compose files support self-hosting. Their presence does not mean the DGTL production service runs in Docker.

## 5. Authentication and the intended client journey

Better Auth manages SEO application sessions and account records. Supabase Auth manages the central DGTL identity. The tools connect through OAuth/OpenID Connect rather than copying user passwords between applications.

The intended sequence is:

1. The client signs in at `auth.dgtl.lk` with Google or email/password.
2. Central authentication returns the client to My services.
3. Open SEO starts `https://seo.dgtl.lk/sso`.
4. SEO completes a central OAuth handoff and checks active SEO entitlement.
5. A new SEO user completes onboarding. A returning user opens an authorized workspace/project.
6. SEO-only logout returns to the central hub without intentionally ending the central session.

The SEO provider uses authorization code flow with PKCE, `openid email profile` scopes, confidential-client authentication, and a server-side UserInfo check. The central access-check endpoint is `/v1/me`. Identity checks, service assignments, and workspace membership are separate checks.

| Authentication mode | Intended use                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `hosted`            | Better Auth sessions, including DGTL SSO when configured                |
| `cloudflare_access` | Cloudflare Access-protected deployment using audience and team settings |
| `local_noauth`      | Trusted local development only; not public production                   |

Current local identity work treats the verified central subject as identity. Matching an email address alone must not grant an old workspace. The local fresh-account policy retires an old login email when a different verified central subject appears, without transferring projects. This affects account recovery and needs explicit review before release. See `DGTL_FRESH_ACCOUNTS.md` and `DGTL_IDENTITY_REPAIR.md`; neither document is proof that a migration has run.

Google login and Google Search Console/Analytics connections are different operations. Signing into DGTL does not grant access to a client's Google reporting properties.

## 6. External services and configuration

| Service                              | Application purpose                                | What an operator must supply/check                                                            |
| ------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| DataForSEO                           | SEO metrics and supported audit/research data      | Valid server credential, provider balance, endpoint availability                              |
| Supabase Auth                        | Central identities and OAuth provider              | Registered SEO client, exact callback URLs, verified identity and permissions                 |
| DGTL backend                         | Client status and assigned services                | Reachable API and valid bearer-token handling                                                 |
| Google APIs                          | Search Console, GA4, and related export workflows  | OAuth configuration, approved scopes, client authorization and property access                |
| OpenRouter                           | Model access for the SAM assistant                 | Server API key, model configuration, usage budget                                             |
| PostHog                              | Product analytics and optional source-map workflow | Public project configuration, consent/opt-out behavior, server configuration where applicable |
| Autumn                               | Billing and usage-entitlement integration          | Secret, webhook verification, plans and billing setup                                         |
| Loops                                | Transactional email and contact synchronization    | API key and applicable template identifiers                                                   |
| Dub                                  | Optional referral tracking                         | Server API key and referral setup                                                             |
| Cloudflare Turnstile                 | Optional signup abuse protection                   | Public site key and server verification secret                                                |
| Better Auth infrastructure/dashboard | Optional auth-management integration               | Appropriate server configuration                                                              |

Stripe-related billing data appears in the code, but there is no direct Stripe SDK in the root dependency manifest. Confirm the payment processor configured behind the billing integration before describing Stripe as an active production dependency.

### Environment variable groups

Use `.env.example`, `src/env.d.ts`, and the deployment runbooks for the full configuration contract. This guide contains names only, never secret values.

| Group                     | Important names                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Application auth          | `AUTH_MODE`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`                                                                                           |
| Central SSO server        | `DGTL_SSO_ENABLED`, `DGTL_SSO_REQUIRED`, `DGTL_SSO_DISCOVERY_URL`, `DGTL_SSO_CLIENT_ID`, `DGTL_SSO_CLIENT_SECRET`, `DGTL_SSO_ACCESS_CHECK_URL` |
| Browser SSO behavior      | `VITE_DGTL_SSO_ENABLED`, `VITE_DGTL_SSO_AUTO_REDIRECT`                                                                                         |
| Database                  | `DATABASE_PROVIDER`, optional `HYPERDRIVE` binding                                                                                             |
| SEO data                  | `DATAFORSEO_API_KEY`                                                                                                                           |
| Google connections        | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                                                                                     |
| AI                        | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`                                                                                                       |
| Analytics                 | `POSTHOG_PUBLIC_KEY`, `POSTHOG_HOST`                                                                                                           |
| Billing                   | `AUTUMN_SECRET_KEY`, `AUTUMN_WEBHOOK_SECRET`                                                                                                   |
| Email                     | `LOOPS_API_KEY` and transactional template IDs                                                                                                 |
| Access / abuse protection | `TEAM_DOMAIN`, `POLICY_AUD`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                                                      |

Keep client secrets, service-role keys, OAuth tokens, and passwords out of Git, browser bundles, screenshots, and logs. `VITE_` settings are browser-facing. Base64 encoding a DataForSEO credential does not make it safe to expose.

## 7. AI and agent technologies

The AI SDK (`ai`, `@ai-sdk/react`) provides AI application primitives. The OpenRouter provider connects model requests. Cloudflare `agents` and `@cloudflare/think` support the stateful SAM agent. Model Context Protocol packages implement agent-facing client/server integrations, with Cloudflare's Workers OAuth provider supporting MCP authorization.

`plugins/openseo/` contains plugin material. `.agents/skills/` contains agent workflow instructions. These folders help developers and AI clients use the product; they are not user authentication databases.

## 8. Folder and important-file guide

| Path                                                   | Responsibility                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `src/client/components/`                               | Reusable interface components                                  |
| `src/client/features/`                                 | Feature-oriented UI                                            |
| `src/client/hooks/`                                    | Shared React hooks                                             |
| `src/client/styles/`                                   | Application styling and DGTL theme                             |
| `src/routes/`                                          | Pages, layouts, and API route entry points                     |
| `src/routeTree.gen.ts`                                 | Generated route registry; regenerate instead of hand-editing   |
| `src/serverFunctions/`                                 | Client-callable server-function entry points                   |
| `src/server/features/`                                 | Feature services and related backend code                      |
| `src/server/auth/`                                     | Identity, organization access, and auth repositories           |
| `src/server/mcp/`                                      | MCP transport, authorization, tools                            |
| `src/server/workflows/`                                | Background workflows                                           |
| `src/server/billing/`, `email/`, `referrals/`, `gdpr/` | Supporting backend services under `src/server/`                |
| `src/middleware/`                                      | Request authentication and user-context resolution             |
| `src/lib/`                                             | Shared configuration and application helpers                   |
| `src/shared/`, `src/types/`                            | Shared contracts, constants, types and schemas                 |
| `src/db/`                                              | Database selection, schemas and database helpers               |
| `drizzle/`, `drizzle-pg/`                              | SQLite and PostgreSQL migrations                               |
| `src/server.ts`                                        | Main Worker entry point                                        |
| `src/audit-worker.ts`                                  | Separate audit Worker entry point                              |
| `src/lib/auth.ts`, `auth-config.ts`, `dgtl-sso.ts`     | Auth construction, policies and central provider configuration |
| `src/routes/sso.tsx`                                   | Hub-to-SEO SSO entry                                           |
| `scripts/`                                             | Maintenance, release, seed and diagnostic tools                |
| `e2e/`                                                 | Browser test scenarios                                         |
| `docs/`, `runbooks/`                                   | Setup guides and operational instructions                      |
| `public/`                                              | Static assets                                                  |
| `web/`                                                 | Separate marketing/documentation application                   |
| `badseo/`                                              | Deliberately broken SEO fixture application for audit tests    |
| `package.json`, `pnpm-lock.yaml`                       | Direct dependencies/scripts and resolved dependency tree       |
| `vite.config.ts`                                       | App bundling, Cloudflare/TanStack plugins, local port          |
| `wrangler.jsonc`, `wrangler.audit.jsonc`               | Worker names, bindings and deployment configuration            |
| `alchemy*.ts`                                          | Infrastructure configuration                                   |
| `Dockerfile.selfhost`, `compose.yaml`                  | Docker self-host setup                                         |

## 9. Supporting applications

`web/` uses React 19, TanStack Start/Router, Vite, Tailwind, Fumadocs and MDX. Fumadocs provides documentation components and MDX processing. It has its own package manifest and deployment scripts.

`badseo/` uses React, TanStack Start/Router, Vite and Cloudflare tooling. Its intentional SEO mistakes provide test cases for the audit engine. Do not treat its failing SEO checks as defects in the client application.

Install dependencies for these projects separately as described in `LOCAL_DEVELOPMENT.md`.

## 10. Local development

The existing local guide specifies Node.js 20+. Some maintenance scripts specify Node.js 22+. Use a Node version supported by the installed tools and the exact pnpm version declared in the manifest.

From the repository root:

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Set `AUTH_MODE=local_noauth` in `.env.local` for a trusted local UI development session. Add the provider credentials required for the features you intend to exercise. Do not use this mode for a public deployment or as proof that hosted SSO works.

```sh
pnpm run db:migrate:local
pnpm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Open `http://localhost:3001`. Hosted SSO testing needs a separate, registered local callback and matching server/browser settings. Do not point local experiments at production database migrations.

## 11. Testing and code quality

| Tool                     | Purpose                              |
| ------------------------ | ------------------------------------ |
| Vitest                   | Unit and integration-style tests     |
| Playwright               | Browser end-to-end tests             |
| TypeScript compiler      | Type checking                        |
| Oxlint / oxlint-tsgolint | Linting, including type-aware checks |
| Prettier                 | Formatting                           |
| Knip                     | Unused-code/dependency analysis      |
| BadSEO                   | Audit behavior fixtures              |
| Portless                 | Named local development URLs         |
| tsx                      | Run TypeScript maintenance scripts   |

```sh
pnpm run types:check
pnpm test
pnpm run lint
pnpm run build
pnpm run test:e2e
```

Consult `playwright.config.ts` before browser tests for server and fixture requirements. This documentation task did not rerun these application checks. Earlier test results do not certify newer uncommitted code.

## 12. Deployment and security notes

Review the main and audit Worker configurations together before deploying. Check generated output paths: some scripts/comments retain the older `open_seo_audit` name, while the current configured audit Worker is `ceo-dgtl-audit`. Do not assume a stale script points to the built artifact.

The root `deploy` script includes production database migration. It is not a harmless preview command. Confirm backups, migration scope, environment, secret bindings and rollback plans before running it.

Implemented security mechanisms include validated inputs, verified central UserInfo, OAuth PKCE, token encryption configuration, workspace membership checks and service-entitlement checks. These mechanisms need tests and operational review; the presence of a library is not a security certification.

Production acceptance checks should include new-user onboarding, returning-user access, same-browser account switching, cross-project isolation, expired tokens, suspended clients, logout behavior and failed-provider responses. Do not weaken permission checks to hide a login failure.

## 13. Status and remaining work

During the earlier September investigation, a tested SEO account had multiple central identity links and failed the one-identity access guard. The current checkout contains additional identity-repair and fresh-account work, including uncommitted files. This guide does not claim the historical database conflict still exists, or that the newer work has resolved it in production. A new deployment/database audit and browser test are required to establish current status.

The central login and hub-to-SEO `/sso` handoff were observed in earlier live checks. Complete onboarding/dashboard success for all account states was not established by those checks. CMS, HR and CRM integrations remain separate work for their maintainers; no live verification of those tools was performed here.

Next engineering steps:

1. Review the current uncommitted identity policy and maintenance tooling before release.
2. Verify central identity mappings using authorized, scoped access and a recoverable repair plan.
3. Build and test the exact commit intended for deployment.
4. Verify both new and existing clients through the production hub, including account switching.
5. Configure each other tool as its own OAuth client, with exact HTTPS callbacks and independent authorization checks.
6. Confirm the CMS tile destination and HTTPS readiness with its maintainer.

## 14. Further repository documentation

- [Local development](LOCAL_DEVELOPMENT.md)
- [Architecture and folders](ARCHITECTURE_AND_FOLDERS.md)
- [DGTL SSO setup](DGTL_SSO_SETUP.md)
- [Fresh central identities](DGTL_FRESH_ACCOUNTS.md)
- [Identity repair](DGTL_IDENTITY_REPAIR.md)
- [Cloudflare self-hosting](SELF_HOSTING_CLOUDFLARE.md)
- [Docker self-hosting](SELF_HOSTING_DOCKER.md)
- [PostgreSQL development](LOCAL_POSTGRES.md)
- [DataForSEO credentials](DATAFORSEO_API_KEY.md)

## 15. Complete direct-dependency inventory

The tables below reproduce every direct runtime and development dependency from the three inspected package manifests. A declared dependency can be optional or used only in certain code paths. Transitive dependencies are recorded in the relevant lockfile and are not expanded here. Version ranges are preserved as declared.

### Main SEO application

#### dependencies

| Package                              | Declared version |
| ------------------------------------ | ---------------- |
| `@ai-sdk/react`                      | `^3.0.211`       |
| `@better-auth/api-key`               | `1.6.22`         |
| `@better-auth/core`                  | `1.6.22`         |
| `@better-auth/infra`                 | `0.4.7`          |
| `@better-auth/utils`                 | `0.4.2`          |
| `@cloudflare/think`                  | `0.17.0`         |
| `@cloudflare/workers-oauth-provider` | `^0.10.2`        |
| `@every-app/sdk`                     | `^0.1.14`        |
| `@modelcontextprotocol/client`       | `2.0.0`          |
| `@modelcontextprotocol/sdk`          | `1.30.0`         |
| `@modelcontextprotocol/server`       | `2.0.0`          |
| `@openrouter/ai-sdk-provider`        | `^2.9.0`         |
| `@tanstack/query-core`               | `^5.101.2`       |
| `@tanstack/react-form`               | `^1.33.0`        |
| `@tanstack/react-query`              | `^5.101.2`       |
| `@tanstack/react-router`             | `^1.170.16`      |
| `@tanstack/react-router-devtools`    | `^1.167.0`       |
| `@tanstack/react-start`              | `^1.168.26`      |
| `@tanstack/react-table`              | `^8.21.3`        |
| `agents`                             | `0.22.0`         |
| `ai`                                 | `^6.0.199`       |
| `autumn-js`                          | `^1.2.33`        |
| `better-auth`                        | `^1.6.22`        |
| `better-call`                        | `1.3.7`          |
| `cloudflare`                         | `^5.2.0`         |
| `daisyui`                            | `^5.5.5`         |
| `drizzle-orm`                        | `^0.45.2`        |
| `fast-xml-parser`                    | `^5.4.1`         |
| `htmlparser2`                        | `^10.1.0`        |
| `jose`                               | `^6.0.12`        |
| `lucide-react`                       | `^0.542.0`       |
| `papaparse`                          | `^5.5.3`         |
| `postgres`                           | `^3.4.9`         |
| `posthog-js`                         | `^1.395.0`       |
| `posthog-node`                       | `^5.38.6`        |
| `react`                              | `^19.0.0`        |
| `react-dom`                          | `^19.0.0`        |
| `react-markdown`                     | `^10.1.0`        |
| `recharts`                           | `^3.7.0`         |
| `remark-gfm`                         | `^4.0.1`         |
| `remeda`                             | `^2.33.6`        |
| `robots-parser`                      | `^3.0.1`         |
| `sonner`                             | `^2.0.7`         |
| `tailwindcss`                        | `^4.1.16`        |
| `tldts`                              | `^7.0.25`        |
| `yaml`                               | `^2.9.0`         |
| `zod`                                | `^4.1.12`        |

#### devDependencies

| Package                       | Declared version |
| ----------------------------- | ---------------- |
| `@cloudflare/vite-plugin`     | `^1.42.3`        |
| `@cloudflare/workers-types`   | `^4.20260702.1`  |
| `@distilled.cloud/cloudflare` | `0.28.2`         |
| `@effect/platform-node`       | `4.0.0-beta.93`  |
| `@libsql/client`              | `^0.15.15`       |
| `@playwright/test`            | `^1.59.1`        |
| `@tailwindcss/vite`           | `^4.1.11`        |
| `@tanstack/devtools-vite`     | `^0.6.1`         |
| `@tanstack/react-devtools`    | `^0.10.8`        |
| `@types/node`                 | `^22.18.13`      |
| `@types/papaparse`            | `^5.5.2`         |
| `@types/react`                | `^19.0.8`        |
| `@types/react-dom`            | `^19.0.3`        |
| `@vitejs/plugin-react`        | `^4.6.0`         |
| `alchemy`                     | `2.0.0-beta.61`  |
| `chalk`                       | `^5.6.2`         |
| `cheerio`                     | `^1.2.0`         |
| `drizzle-kit`                 | `^0.31.10`       |
| `effect`                      | `4.0.0-beta.93`  |
| `knip`                        | `^5.88.1`        |
| `oxlint`                      | `^1.50.0`        |
| `oxlint-tsgolint`             | `^0.15.0`        |
| `portless`                    | `^0.5.2`         |
| `prettier`                    | `^3.6.2`         |
| `tsx`                         | `^4.22.4`        |
| `typescript`                  | `^5.9.3`         |
| `vite`                        | `^7.3.6`         |
| `vite-tsconfig-paths`         | `^5.1.4`         |
| `vitest`                      | `^3.2.6`         |
| `wrangler`                    | `^4.105.0`       |

### Marketing and documentation site

#### dependencies

| Package                           | Declared version |
| --------------------------------- | ---------------- |
| `@tanstack/react-router`          | `^1.168.10`      |
| `@tanstack/react-router-devtools` | `^1.166.11`      |
| `@tanstack/react-start`           | `^1.167.16`      |
| `fumadocs-core`                   | `^15.5.1`        |
| `fumadocs-mdx`                    | `^11.6.5`        |
| `fumadocs-ui`                     | `^15.5.1`        |
| `react`                           | `^19.1.0`        |
| `react-dom`                       | `^19.1.0`        |
| `vite`                            | `^7.3.1`         |
| `zod`                             | `^3.24.0`        |

#### devDependencies

| Package                   | Declared version |
| ------------------------- | ---------------- |
| `@cloudflare/vite-plugin` | `^1.13.3`        |
| `@tailwindcss/vite`       | `^4.1.18`        |
| `@types/mdx`              | `^2.0.13`        |
| `@types/node`             | `^22.10.2`       |
| `@types/react`            | `^19.2.13`       |
| `@types/react-dom`        | `^19.2.3`        |
| `@vitejs/plugin-react`    | `^5.1.3`         |
| `prettier`                | `^3.6.2`         |
| `srvx`                    | `^0.11.2`        |
| `tailwindcss`             | `^4.1.18`        |
| `typescript`              | `^5.9.3`         |
| `vite-tsconfig-paths`     | `^6.0.5`         |
| `wrangler`                | `^4.67.0`        |

### BadSEO audit fixture

#### dependencies

| Package                  | Declared version |
| ------------------------ | ---------------- |
| `@tanstack/react-router` | `^1.170.16`      |
| `@tanstack/react-start`  | `^1.168.26`      |
| `react`                  | `^19.0.0`        |
| `react-dom`              | `^19.0.0`        |

#### devDependencies

| Package                   | Declared version |
| ------------------------- | ---------------- |
| `@cloudflare/vite-plugin` | `^1.42.3`        |
| `@types/react`            | `^19.0.8`        |
| `@types/react-dom`        | `^19.0.3`        |
| `@vitejs/plugin-react`    | `^4.6.0`         |
| `tsx`                     | `^4.21.0`        |
| `typescript`              | `^5.9.3`         |
| `vite`                    | `^7.3.6`         |
| `wrangler`                | `^4.67.0`        |
