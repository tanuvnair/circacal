import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import {
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";

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
  const [showPassword, setShowPassword] = useState(false);
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
          <FieldGroup>
            <Field data-invalid={fieldErrors.email ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                />
                <InputGroupAddon>
                  <MailIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
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
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!fieldErrors.password}
                />
                <InputGroupAddon>
                  <LockIcon className="text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <LogInIcon data-icon="inline-start" /> Sign In
              </>
            )}
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
