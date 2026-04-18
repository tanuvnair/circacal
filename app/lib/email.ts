// Simple email sending utility for development.
// Replace with a real provider (e.g., Resend, SendGrid) in production.

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // For now, just log to console
  console.log(`[Email] To: ${to}\nSubject: ${subject}\n${text}`);
}
