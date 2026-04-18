import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNavigate, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { auth } from "~/lib/auth.server";
import type { LoaderResult } from "~/types/handler-result";

export function meta() {
  return [{ title: "Verify Email - CircaCal" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    const result: LoaderResult = {
      status: "error",
      message: "Verification token is missing.",
    };
    return result;
  }

  try {
    await auth.api.verifyEmail({ query: { token } });
    const result: LoaderResult = {
      status: "success",
      message: "Your email has been verified. You can now sign in.",
    };
    return result;
  } catch (e: any) {
    const result: LoaderResult = {
      status: "error",
      message: "Verification token is invalid or expired.",
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
            <AlertDescription>{data.message}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="text-destructive" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{data.message}</AlertDescription>
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
