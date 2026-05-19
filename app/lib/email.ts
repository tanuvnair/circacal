import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM = process.env.EMAIL_FROM || "CircaCal <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!resend) {
    console.log(
      `[Email (Console Fallback)]\nTo: ${to}\nSubject: ${subject}\nText:\n${text}\n-------------------`
    );
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });

    if (error) {
      console.error("[Email (Resend)] Failed to send email:", error);
      throw error;
    }

    console.log(`[Email (Resend)] Sent successfully to ${to}. Message ID: ${data?.id}`);
    return data;
  } catch (error) {
    console.error("[Email (Resend)] Unexpected error:", error);
    throw error;
  }
}

