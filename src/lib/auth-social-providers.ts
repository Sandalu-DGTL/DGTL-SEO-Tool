import { isHostedAuthMode } from "./auth-mode";

type SocialProviderEnv = {
  AUTH_MODE?: string;
  DGTL_SSO_REQUIRED?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

export function getSocialProviders(env: SocialProviderEnv) {
  // Central-only login must also disable the direct social-login API, not
  // just its UI. GSC/GA4 connections use separate genericOAuth providers.
  if (!isHostedAuthMode(env.AUTH_MODE) || env.DGTL_SSO_REQUIRED === "true") {
    return {};
  }

  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId && !clientSecret) return {};
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is required in hosted mode");
  if (!clientSecret)
    throw new Error("GOOGLE_CLIENT_SECRET is required in hosted mode");

  return {
    google: {
      clientId,
      clientSecret,
      mapProfileToUser: (profile: { name?: string }) => ({
        name: profile.name,
      }),
    },
  };
}
