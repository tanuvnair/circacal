import { useState } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { MailIcon, SendIcon } from "lucide-react";
import { authClient } from "~/lib/auth.client";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export function meta() {
  return [{ title: "Forgot Password - CircaCal" }];
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    await authClient.requestPasswordReset({
      email,
      redirectTo: window.location.origin + "/reset-password",
    });

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          {submitted
            ? "Check your email for a reset link"
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      {!submitted ? (
        <>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <Field data-invalid={fieldError ? true : undefined}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!fieldError}
                    />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{fieldError}</FieldError>
                </Field>
              </FieldGroup>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <SendIcon data-icon="inline-start" /> Send Reset Link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-col gap-4">
          <Alert>
            <AlertDescription>
              If an account with that email exists, we&apos;ve sent a password
              reset link. Please check your inbox.
            </AlertDescription>
          </Alert>
          <Link
            to="/sign-in"
            className="text-sm text-primary underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </CardContent>
      )}
    </>
  );
}
