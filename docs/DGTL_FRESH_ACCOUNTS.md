# Fresh accounts after central-user recreation

DGTL OAuth's verified UserInfo subject is the account identity, not the email.
The server preparation hook runs only after verified email and central active
SEO entitlement checks. A known subject keeps its existing SEO account.

For an unknown subject, any old local account occupying the same email is
renamed to `<old-local-id>@retired-identity.invalid` and marked email-unverified.
No account links, memberships, projects, billing records or tokens are copied
or deleted. Better Auth can then create a separate user with the real contact
email, and normal new-user workspace provisioning/onboarding applies.
Retirement is enforced by the live authorization query, including old cached
sessions. The old contact email is replaced in the user row; this is a retired
login address, never a deliverable mailbox.

This applies to existing legacy accounts too: an email match alone no longer
recovers their workspace. Explicit recovery, if ever needed, is a separate
administrator-reviewed process. Do not run email-based relinking maintenance
to override this policy.

Failure handling: database lookup/update failures fail login closed. If
provisioning fails after retirement, the old data remains and the client can
retry. Concurrent first sign-ins may hit the existing unique-email constraint
and require a retry; no membership is transferred to resolve that conflict.

Release checks: recreate a disposable test identity with the same email,
verify a different local user and organization, verify empty onboarding state,
verify old project URLs are denied, then sign in again and verify the new
workspace is reused. Do not delete real client identities for testing.

Implementation is local until explicitly built/deployed and those browser
checks have passed. Existing historical email-based merges are not undone by
this change; they require a separate data review.
