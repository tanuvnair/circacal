import { useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { redirect, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/settings";
import { SearchableCombobox } from "~/components/searchable-combobox";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { isAllowedTimeZone, timezones } from "~/constants/timezones";
import {
  findUserById,
  updateUserTimeZone,
} from "~/db-repositories/user.repository.server";
import { getSession } from "~/lib/auth.server";

function defaultTimeZone(): string {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezones.some((t) => t.value === detected)
    ? detected
    : "America/Los_Angeles";
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const user = await findUserById(session.user.id);
  const stored = user?.timeZone ?? null;
  const initialTimeZone =
    stored !== null && isAllowedTimeZone(stored) ? stored : null;

  return { initialTimeZone };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const formData = await request.formData();
  const raw = formData.get("timeZone");
  if (typeof raw !== "string" || !isAllowedTimeZone(raw)) {
    return { ok: false as const, error: "Invalid time zone." };
  }

  await updateUserTimeZone(session.user.id, raw);

  return { ok: true as const, timeZone: raw };
}

export function meta() {
  return [{ title: "Settings - CircaCal" }];
}

export default function Settings() {
  const { initialTimeZone } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [timeZone, setTimeZone] = useState(
    () => initialTimeZone ?? defaultTimeZone(),
  );

  const lastResult = fetcher.data;
  const errorMessage =
    lastResult && "ok" in lastResult && !lastResult.ok
      ? lastResult.error
      : null;
  const showSuccess =
    fetcher.state === "idle" &&
    lastResult !== undefined &&
    "ok" in lastResult &&
    lastResult.ok;
  const isSaving = fetcher.state !== "idle";

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Settings
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Setup your account preferences.
        </p>
      </div>

      {showSuccess ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Settings saved</AlertTitle>
          <AlertDescription>Your settings have been updated.</AlertDescription>
        </Alert>
      ) : null}

      <fetcher.Form method="post">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="settings-timezone-trigger">
              Time zone
            </FieldLabel>
            <FieldDescription>
              Used for dates and daily resets.
            </FieldDescription>

            <FieldContent className="flex flex-col gap-3">
              <SearchableCombobox
                id="settings-timezone-trigger"
                value={timeZone}
                onValueChange={setTimeZone}
                options={timezones}
                searchPlaceholder="Search time zone..."
                emptyMessage="No time zone found."
              />
              <input type="hidden" name="timeZone" value={timeZone} />
              {errorMessage ? (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </FieldContent>
          </Field>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save Settings"}
          </Button>
        </FieldGroup>
      </fetcher.Form>
    </div>
  );
}
