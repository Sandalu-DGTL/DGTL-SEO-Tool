import { expect, it } from "vitest";
import { passwordAuthEnabled } from "./password-auth-policy";

it.each([
  [false, false, false],
  [false, true, false],
  [true, false, false],
  [true, true, true],
])(
  "combines central policy %s and deployment capability %s",
  (policy, configured, expected) => {
    expect(passwordAuthEnabled(policy, configured)).toBe(expected);
  },
);
