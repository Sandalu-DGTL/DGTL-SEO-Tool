# Dashboard cleanup and test report

Date: 28 September 2026. Branch: `dev-seo`. Local changes only; not deployed.

## What changed

- Removed five sample-only files under `src/client/features/dashboard/dgtl-overview/`: fabricated metrics, traffic charts, ranking buckets, backlink counts, keyword opportunities and visitor-behavior figures.
- Replaced the re-export wrapper with a small dashboard header. The dashboard route remains.
- Preserved the existing live Search Console, Analytics, audit and backlink cards, workspace setup, navigation, server queries and permission checks.
- Removed CSS selectors used only by the deleted sample panels.
- Removed the landing page's fictional client, scores, growth figures and SVG trend, replacing them with setup instructions. Login links are unchanged.
- Added two dashboard regression tests for the heading/setup message and absence of sample metrics.
- Made Playwright start the installed Vite executable directly rather than invoking an incompatible global pnpm.

No production records, credentials, providers, billing behavior or authentication logic were changed by this cleanup. Pre-existing local changes remain in the working tree.

## Size and folder decisions

Approximate disk sizes before cleanup:

| Folder               | Size   | Decision                                                                                  |
| -------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `node_modules`       | 1.8 GB | Keep required dependencies. This entire folder is not uploaded as the application bundle. |
| `node_modules/.vite` | 102 MB | Removed after browser testing. Regenerates automatically on development startup.          |
| `dist`               | 24 MB  | Rebuilt hosted artifacts; retain for deployment inspection.                               |
| `src`                | 6.1 MB | Remove verified sample-only source, not functioning tools.                                |
| `web`                | 7.8 MB | Keep the separate website; not established as disposable.                                 |
| `badseo`             | 328 KB | Keep the audit test project; referenced by the quality checks.                            |
| `.wrangler`          | 2.5 MB | Preserve local database/runtime state.                                                    |
| `.git`               | 28 MB  | Preserve version history and recovery.                                                    |

Roughly 650 lines of sample-only components/data were deleted. Source now rounds to 6.0 MB. The generated output still rounds to 24 MB; this is not a claim of a large deployment-size reduction. Recharts remains necessary for real tool charts.

Test fixtures and seed utilities are not customer dashboard data. They were kept so regression tests and documented development workflows continue to function. Production build fixture flags were explicitly disabled.

## Test results

| Check                                 | Result            | Evidence / limitation                                                                                                                                                                                                                                          |
| ------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Complete Vitest suite                 | PASS              | 180 test files, 1,446 tests, including two new dashboard tests.                                                                                                                                                                                                |
| Main TypeScript                       | PASS              | `tsc --noEmit`.                                                                                                                                                                                                                                                |
| Audit fixture TypeScript              | PASS              | `tsc --noEmit -p badseo/tsconfig.json`.                                                                                                                                                                                                                        |
| Type-aware lint                       | PASS              | No warnings or errors.                                                                                                                                                                                                                                         |
| Unused-code scan                      | PASS              | Knip completed without findings.                                                                                                                                                                                                                               |
| Hosted build                          | PASS              | Main and audit Worker artifacts built with demo/fixture flags disabled.                                                                                                                                                                                        |
| Built-client dummy-data search        | PASS              | Removed sample metric/chart identifiers absent from generated client JavaScript.                                                                                                                                                                               |
| Changed TS/TSX/config formatting      | PASS              | Prettier passed on changed dashboard files and Playwright config.                                                                                                                                                                                              |
| Repository-wide formatting            | FAIL              | Existing style differences in Sidebar.tsx, error-messages.ts, app.css and wrangler.jsonc. Unrelated formatting was not rewritten.                                                                                                                              |
| Diff whitespace check                 | PASS              | `git diff --check`.                                                                                                                                                                                                                                            |
| Browser E2E                           | FAIL / INCOMPLETE | Final fail-fast run: 1 failed, 10 not run. The first test timed out waiting for `/p/<id>`; the browser stayed on the public landing page. Browser teardown also reported system error -88. Earlier attempts hit global pnpm and missing FFmpeg setup problems. |
| Production / real-provider smoke test | NOT RUN           | This cleanup was local. No paid API calls or deployment.                                                                                                                                                                                                       |

Type checking and tests do not prove every production integration works. Previously observed production keyword errors are outside this cleanup and are not claimed fixed. The FFmpeg installer was stopped after it stalled following download; its setup is not claimed fully verified. Browser failure evidence remains in `test-results/domain-overview-filters.pe-f221c-he-applied-filter-edit-flow/`.

## Reproduce

```bash
corepack pnpm exec vitest run
corepack pnpm exec tsc --noEmit
corepack pnpm exec tsc --noEmit -p badseo/tsconfig.json
corepack pnpm exec oxlint . --type-aware
corepack pnpm exec knip
corepack pnpm exec prettier --check .
corepack pnpm exec playwright install ffmpeg
corepack pnpm exec playwright test
```

Use the hosted production environment for the build, with `AUTH_MODE=hosted`, demo authentication disabled and `VITE_E2E_DOMAIN_FIXTURES=0` / `VITE_E2E_KEYWORD_FIXTURES=0`. Do not deploy fixture builds.

## Recovery and release

Deleted source files are tracked and recoverable from Git. Do not reset the entire dirty working tree to recover them; restore only the requested sample files if needed. Disposable caches regenerate on the next development run.

Before deployment, resolve browser-test setup/failures and inspect the dashboard with a real authorized session. The rest of the release blockers in `DGTL_SEO_RELEASE_PROGRESS.md` remain separate work.
