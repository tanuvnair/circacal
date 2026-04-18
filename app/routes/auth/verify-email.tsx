import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNavigate, useSearchParams, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { LoaderResult } from "~/types/loader-result";
import { authClient } from "~/lib/auth.client";

export function meta() {
  return [{ title: "Verify Email - CircaCal" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    const result: LoaderResult = {
      status: "error",
      message: "Missing verification token.",
    };
    return result;
  }

  try {
    await authClient.verifyEmail({ query: { token } });
    const result: LoaderResult = { status: "success" };
    return result;
  } catch (e: any) {
    const result: LoaderResult = {
      status: "error",
      message: e?.message || "Verification failed.",
    };
    return result;
  }
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const data = useLoaderData() as LoaderResult;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Verify Email</CardTitle>
      </CardHeader>
      <CardContent className="flex-col space-y-4">
        {data.status === "success" ? (
          <Alert>
            <CheckCircle />
            <AlertTitle>Email Verified</AlertTitle>
            <AlertDescription>
              Your email has been verified, you may sign in now.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="text-destructive" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              {data.message ||
                "Verification failed. Please try again or request a new link."}
            </AlertDescription>
          </Alert>
        )}

        <Button
          size={"sm"}
          variant={"link"}
          onClick={() => navigate("/sign-in")}
        >
          Go to Sign In
        </Button>
      </CardContent>
    </>
  );
}
