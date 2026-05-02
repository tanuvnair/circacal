import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function BodyMetricLogSuccessAlert() {
  return (
    <Alert>
      <CheckCircle2Icon />
      <AlertTitle>Logged</AlertTitle>
      <AlertDescription>
        Your metrics were saved as a new entry.
      </AlertDescription>
    </Alert>
  );
}
