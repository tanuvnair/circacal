import { Input } from "~/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";

export function meta() {
  return [{ title: "Body metrics - CircaCal" }];
}

export default function BodyMetrics() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Body metrics
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Weight, height, and notes. Nothing is saved yet—this screen is UI-only
          for now.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="body-metrics-weight">Current weight</FieldLabel>
          <FieldContent className="gap-2">
            <Input
              id="body-metrics-weight"
              name="weight"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 72.5"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="body-metrics-height">
            Height (optional)
          </FieldLabel>
          <FieldContent className="gap-2">
            <Input
              id="body-metrics-height"
              name="height"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 175"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="body-metrics-notes">Notes (optional)</FieldLabel>
          <FieldContent className="gap-2">
            <Input
              id="body-metrics-notes"
              name="notes"
              type="text"
              autoComplete="off"
              placeholder="e.g. goal weight, injuries, context"
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
