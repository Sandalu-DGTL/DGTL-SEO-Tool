import { beforeEach, expect, it, vi } from "vitest";
import { prepareFreshCentralIdentity } from "./fresh-central-identity";
const mocks = vi.hoisted(() => ({ has: vi.fn(), retire: vi.fn() }));
vi.mock("./repositories/AuthRepository", () => ({
  AuthRepository: {
    hasDgtlSubject: mocks.has,
    retireEmailForFreshIdentity: mocks.retire,
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.has.mockResolvedValue(false);
  mocks.retire.mockResolvedValue(undefined);
});
it("separates a new subject from an existing email without copying memberships", async () => {
  await prepareFreshCentralIdentity({
    id: "new-subject",
    email: "same@example.com",
  });
  expect(mocks.has).toHaveBeenCalledWith("new-subject");
  expect(mocks.retire).toHaveBeenCalledWith("same@example.com");
});
it("preserves the workspace for a returning subject", async () => {
  mocks.has.mockResolvedValue(true);
  await prepareFreshCentralIdentity({
    id: "existing",
    email: "same@example.com",
  });
  expect(mocks.retire).not.toHaveBeenCalled();
});
it("fails closed when identity lookup fails", async () => {
  mocks.has.mockRejectedValue(new Error("offline"));
  await expect(
    prepareFreshCentralIdentity({ id: "new", email: "same@example.com" }),
  ).rejects.toThrow("offline");
  expect(mocks.retire).not.toHaveBeenCalled();
});
