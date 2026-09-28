import { describe, expect, it } from "vitest";
import { getDgtlAuthErrorCopy } from "./dgtlAuthErrorCopy";

describe("Service Hub login errors", () => {
  it.each(["unable_to_link_account", "account_not_linked"])(
    "explains %s without claiming the authorization expired",
    (code) => {
      const copy = getDgtlAuthErrorCopy(code);
      expect(copy.description).toContain("could not safely match");
      expect(copy.description).not.toContain("expired");
      expect(copy.description).not.toContain("Settings");
    },
  );
  it("does not guess the cause of unknown failures", () => {
    expect(getDgtlAuthErrorCopy(undefined).description).toContain(
      "Service Hub",
    );
  });
});
