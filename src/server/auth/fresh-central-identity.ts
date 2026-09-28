import { AuthRepository } from "./repositories/AuthRepository";

/** Called only after UserInfo and central SEO entitlement have been verified. */
export async function prepareFreshCentralIdentity(identity: {
  id: string;
  email: string;
}) {
  // Returning subjects keep their original workspace, even if their email changes.
  if (await AuthRepository.hasDgtlSubject(identity.id)) return;
  // Email is contact information, not permission to inherit an old workspace.
  await AuthRepository.retireEmailForFreshIdentity(identity.email);
}
