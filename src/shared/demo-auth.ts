import { z } from "zod";

export const LOCAL_DEMO_ACCOUNTS = {
  client: {
    email: "client@dgtl.local",
    password: "DemoClient123!",
    session: "dgtl-client-v1",
    role: "client",
  },
} as const;

export const LOCAL_DEMO_COOKIE = "dgtl_demo_session";

export const demoCredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const demoSessionSchema = z.discriminatedUnion("authenticated", [
  z.object({
    authenticated: z.literal(true),
    email: z.string(),
    role: z.literal("client"),
  }),
  z.object({
    authenticated: z.literal(false),
    email: z.null(),
    role: z.null(),
  }),
]);

export function getLocalDemoAccountBySession(session: string | undefined) {
  return Object.values(LOCAL_DEMO_ACCOUNTS).find(
    (account) => account.session === session,
  );
}
