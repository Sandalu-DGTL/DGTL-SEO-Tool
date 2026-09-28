import { describe, expect, it, vi } from "vitest";
import { genericOAuth } from "better-auth/plugins";
import type * as BetterAuthPlugins from "better-auth/plugins";
import { createBaseAuthConfig } from "./auth-config";
import { getSocialProviders } from "./auth-social-providers";
import { GSC_OAUTH_PROVIDER_ID } from "@/shared/gsc";
import { GA4_OAUTH_PROVIDER_ID } from "@/shared/ga4";

vi.mock("cloudflare:workers", () => ({
  env: {
    AUTH_MODE: "hosted",
    DGTL_SSO_ENABLED: "true",
    DGTL_SSO_REQUIRED: "true",
    DGTL_SSO_DISCOVERY_URL:
      "https://example.com/.well-known/openid-configuration",
    DGTL_SSO_CLIENT_ID: "seo",
    DGTL_SSO_CLIENT_SECRET: "test-only",
    DGTL_SSO_ACCESS_CHECK_URL: "https://example.com/v1/me",
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "test-only",
  },
}));

vi.mock("better-auth/plugins", async (importOriginal) => {
  const actual = await importOriginal<typeof BetterAuthPlugins>();
  return { ...actual, genericOAuth: vi.fn(actual.genericOAuth) };
});

const credentials = {
  GOOGLE_CLIENT_ID: "google-client",
  GOOGLE_CLIENT_SECRET: "test-only",
};

describe("direct Google social login policy", () => {
  it("preserves separate GSC and GA4 OAuth connections in mandatory SSO mode", () => {
    createBaseAuthConfig();
    const providers = vi.mocked(genericOAuth).mock.calls.at(-1)?.[0].config;
    expect(providers?.map(({ providerId }) => providerId)).toEqual([
      GSC_OAUTH_PROVIDER_ID,
      GA4_OAUTH_PROVIDER_ID,
      "dgtl-sso",
    ]);
    for (const providerId of [GSC_OAUTH_PROVIDER_ID, GA4_OAUTH_PROVIDER_ID]) {
      expect(
        providers?.find((provider) => provider.providerId === providerId)
          ?.clientId,
      ).toBe(credentials.GOOGLE_CLIENT_ID);
    }
  });
  it("disables Google login when central SSO is mandatory even with Google credentials", () => {
    expect(
      getSocialProviders({
        ...credentials,
        AUTH_MODE: "hosted",
        DGTL_SSO_REQUIRED: "true",
      }),
    ).toEqual({});
  });

  it.each(["false", undefined])(
    "preserves optional hosted Google login (%s)",
    (required) => {
      expect(
        getSocialProviders({
          ...credentials,
          AUTH_MODE: "hosted",
          DGTL_SSO_REQUIRED: required,
        }),
      ).toMatchObject({ google: { clientId: credentials.GOOGLE_CLIENT_ID } });
    },
  );

  it.each(["local_noauth", "cloudflare_access", undefined])(
    "never enables Google social login outside hosted mode (%s)",
    (mode) => {
      expect(getSocialProviders({ ...credentials, AUTH_MODE: mode })).toEqual(
        {},
      );
    },
  );

  it("permits hosted deployments without Google credentials", () => {
    expect(getSocialProviders({ AUTH_MODE: "hosted" })).toEqual({});
  });

  it.each([
    [{ GOOGLE_CLIENT_ID: "client" }, "GOOGLE_CLIENT_SECRET"],
    [{ GOOGLE_CLIENT_SECRET: "test-only" }, "GOOGLE_CLIENT_ID"],
  ])(
    "rejects incomplete credentials outside mandatory SSO (%j)",
    (partial, missing) => {
      expect(() =>
        getSocialProviders({ AUTH_MODE: "hosted", ...partial }),
      ).toThrow(missing);
    },
  );
});
