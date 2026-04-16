import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { authClient } from "~/lib/auth.client";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
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
import { Input } from "~/components/ui/input";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof signInSchema>, string>>;

export function meta() {
  return [{ title: "Sign In - CircaCal" }];
}

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const result = signInSchema.safeParse({ email, password });
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

    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
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
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Welcome back to CircaCal</CardDescription>
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
            <Field data-invalid={fieldErrors.email ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>
            <Field data-invalid={fieldErrors.password ? true : undefined}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
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
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
