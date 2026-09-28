/** A deployment capability must never override a disabled authentication policy. */
export function passwordAuthEnabled(
  policyEnabled: boolean,
  configured: boolean,
): boolean {
  return policyEnabled && configured;
}
