import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { redirect } from "react-router";
import { prisma } from "~/db/prisma.server";
import { sendEmail } from "~/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verificationLink = `${process.env.BASE_URL || "http://localhost:3000"}/verify-email?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${verificationLink}`,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
});

export async function getSession(request: Request) {
  try {
    return await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("Failed to get session, clearing cookies:", error);

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      "better-auth.session_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
    );
    headers.append(
      "Set-Cookie",
      "better-auth.csrf_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
    );

    throw redirect("/sign-in", { headers });
  }
}
