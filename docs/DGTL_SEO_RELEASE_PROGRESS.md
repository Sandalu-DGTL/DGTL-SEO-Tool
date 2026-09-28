# SEO first-release progress

Date: 28 September 2026. Branch: `dev-seo`.

## Decision

Not ready for a production release yet. This preparation pass used three agents for authentication, deployment and SEO-service review. No production deployment, account repair, database migration or paid provider request was performed.

The owner requested no paid tests. DataForSEO live-result acceptance remains unverified; fixture results must not be substituted for that evidence.

## Checks completed

- Baseline TypeScript check passed.
- Baseline unit/integration suite passed: 177 files, 1,432 tests.
- After local fixes, the complete suite passed: 179 files, 1,444 tests.
- Hosted Vite production build passed with demo authentication and keyword/domain fixture flags disabled.
- Authentication-focused checks passed: 42 tests across six files.
- Extended authentication checks passed: 52 tests across seven files, including mandatory-SSO Google-provider policy.
- Deployment-command regression tests passed: two tests.

These results do not prove hosted browser login, account switching, connected Google properties or paid providers work end to end. Earlier production observations are documented in the release guide; they were not repeated in this pass.

## Local fixes

- Corrected the obsolete audit-worker deployment artifact path.
- Made both audit and main Worker configuration paths explicit.
- Removed automatic remote database migration from `deploy`; migrations require a separate deliberate command.
- Added regression tests for deployment order and migration separation.
- Replaced an unsafe `as never` authentication-test fixture with a documented parameter-typed fixture.
- Disabled direct SEO Google social login when central DGTL SSO is mandatory. Separate GSC/GA4 connection providers remain available; regression tests cover both behaviors.

Existing uncommitted authentication, dependency and styling changes were preserved. The release source is still not a clean, committed baseline.

## Drawbacks and blockers

| Priority | Finding                                                                                                                                                                             | Required next action                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Blocker  | Fresh identity preparation checks for an existing subject and later retires an email owner in separate operations. Concurrent callbacks can interfere with a newly created account. | Design atomic, subject-aware provisioning and add real database concurrency tests before deployment.                           |
| Blocker  | Retirement happens before the rest of signup completes. A later failure can leave the old user retired without a complete new identity.                                             | Establish rollback/recovery semantics and preserve existing clients. Do not run identity repair as a shortcut.                 |
| High     | Browser tests force local no-auth and fixture-backed data.                                                                                                                          | Add and execute hosted new-user, returning-user, account-switching, cross-project denial and SEO-only logout acceptance tests. |
| High     | The dashboard is a labelled sample report, not live client metrics.                                                                                                                 | Use project-specific real data or honest setup/empty states by default.                                                        |
| High     | Hosted DataForSEO requests require Autumn entitlements/credits as well as provider credentials.                                                                                     | Verify the configuration and intended access model. Paid provider validation is deferred at the owner's request.               |
| Medium   | GSC and GA4 require separate property connections. Central Google login alone does not connect analytics.                                                                           | Test with an authorized property supplied by the owner.                                                                        |
| Medium   | CI push checks target `main`; the preview workflow is restricted to the upstream repository.                                                                                        | Propose CI changes for explicit maintainer review; do not silently change the review control plane.                            |

The concurrency finding is a code-review finding, not a confirmed explanation for the user's earlier production errors. Reproducing those requires a failing request and safe server diagnostics.

## Information still needed

1. An authorized test website and, if GSC is included, a Search Console property the owner can connect.
2. Dedicated central test accounts for new-user and returning-user browser flows. The owner should sign in directly; do not send passwords or tokens.
3. A reviewed approach to old-account preservation during fresh identity creation before applying identity/schema changes.

## Next implementation order

1. Resolve identity provisioning concurrency and recovery with regression tests.
2. Verify mandatory central-login behavior and hosted browser journeys.
3. Replace the default sample overview with real/empty states.
4. Validate no-cost configuration checks and authorized site/Google connections; leave paid provider validation explicitly pending.
5. Re-run complete checks on a reviewed commit, then decide whether the release meets its acceptance criteria.

See [the A–Z guide](./DGTL_SEO_FIRST_RELEASE_GUIDE.md) for the full checklist.
