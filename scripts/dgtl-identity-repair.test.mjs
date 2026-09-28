import { test } from "node:test";
import assert from "node:assert/strict";
import { planIdentityRepair } from "./dgtl-identity-repair.mjs";

test("retires a single confirmed-deleted link without granting a session", () => {
  const link = {
    account_id: "deleted",
    user_id: "any-user",
    email: "any@example.com",
  };
  assert.deepEqual(
    planIdentityRepair([link], new Map([["deleted", { state: "deleted" }]])),
    { keep: null, retire: [link] },
  );
  assert.equal(
    planIdentityRepair([link], new Map([["deleted", { state: "unknown" }]])),
    null,
  );
});

const links = ["old", "current"].map((account_id) => ({
  account_id,
  user_id: "local",
  email: "client@example.com",
}));
const live = { state: "live", email: "client@example.com", verified: true };
test("repairs arbitrary clients only with a verified survivor and confirmed deleted subject", () => {
  const result = planIdentityRepair(
    links,
    new Map([
      ["old", { state: "deleted" }],
      ["current", live],
    ]),
  );
  assert.equal(result.keep.account_id, "current");
  assert.deepEqual(result.retire, [links[0]]);
});
for (const state of ["live", "unknown"])
  test(`does not retire ${state} identities`, () => {
    assert.equal(
      planIdentityRepair(
        links,
        new Map([
          ["old", { ...live, state }],
          ["current", live],
        ]),
      ),
      null,
    );
  });
test("rejects email mismatch and unverified survivor", () => {
  for (const identity of [
    { ...live, email: "other@example.com" },
    { ...live, verified: false },
  ])
    assert.equal(
      planIdentityRepair(
        links,
        new Map([
          ["old", { state: "deleted" }],
          ["current", identity],
        ]),
      ),
      null,
    );
});
test("leaves new and single-link accounts alone", () => {
  assert.equal(planIdentityRepair([], new Map()), null);
  assert.equal(planIdentityRepair([links[1]], new Map()), null);
});
