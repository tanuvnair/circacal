import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { authClient } from "~/lib/auth.client";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FieldErrors = Partial<Record<"password" | "confirmPassword", string>>;

export function meta() {
  return [{ title: "Reset Password - CircaCal" }];
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const tokenError = searchParams.get("error") === "INVALID_TOKEN";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token || tokenError) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">Invalid Link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to="/forgot-password"
            className="text-sm text-primary underline underline-offset-4"
          >
            Request a new reset link
          </Link>
        </CardContent>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    await authClient.resetPassword(
      { newPassword: password, token },
      {
        onSuccess: () => {
          navigate("/sign-in");
        },
        onError: (ctx) => {
          setServerError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <FieldGroup className="gap-4">
            <Field data-invalid={fieldErrors.password ? true : undefined}>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
              />
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>
            <Field
              data-invalid={fieldErrors.confirmPassword ? true : undefined}
            >
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!fieldErrors.confirmPassword}
              />
              <FieldError>{fieldErrors.confirmPassword}</FieldError>
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
