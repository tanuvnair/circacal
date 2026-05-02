import { useState } from "react";
import { SearchableCombobox } from "~/components/searchable-combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { timezones } from "~/constants/timezones";

function defaultTimeZone(): string {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezones.some((t) => t.value === detected)
    ? detected
    : "America/Los_Angeles";
}

export function meta() {
  return [{ title: "Settings - CircaCal" }];
}

export default function Settings() {
  const [timeZone, setTimeZone] = useState(defaultTimeZone);

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

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-timezone-trigger">Time zone</FieldLabel>
          <FieldDescription>Used for dates and daily resets.</FieldDescription>

          <FieldContent className="gap-3">
            <SearchableCombobox
              id="settings-timezone-trigger"
              value={timeZone}
              onValueChange={setTimeZone}
              options={timezones}
              searchPlaceholder="Search time zone..."
              emptyMessage="No time zone found."
            />
          </FieldContent>
        </Field>

        <Button type="button">Save Settings</Button>
      </FieldGroup>
    </div>
  );
}
