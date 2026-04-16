import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/db/prisma.server";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Replace with real email service
      console.log(`[Auth] Password reset link for ${user.email}: ${url}`);
    },
  },
});

export async function getSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}
