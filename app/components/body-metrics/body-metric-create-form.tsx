import type { FetcherWithComponents } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { HeightUnit, WeightUnit } from "../../../generated/prisma/enums";

import type { BodyMetricsActionResult } from "./types";
import { BODY_METRIC_NATIVE_SELECT_CLASS_NAME } from "./metric-select-classname";

type CreateFetcher = FetcherWithComponents<BodyMetricsActionResult>;

export function BodyMetricCreateForm({
  fetcher,
  formKey,
  errorMessage,
}: {
  fetcher: CreateFetcher;
  formKey: number;
  errorMessage: string | null;
}) {
  return (
    <fetcher.Form key={formKey} method="post">
      <input type="hidden" name="_intent" value="create" />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="body-metrics-weight">Weight</FieldLabel>
          <FieldDescription>
            Optional if you only log height or notes. Pick a unit when you enter
            a weight.
          </FieldDescription>
          <FieldContent className="flex flex-row flex-wrap items-stretch gap-2">
            <Input
              id="body-metrics-weight"
              name="weight"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 72.5"
              className="min-w-0 flex-1"
            />
            <select
              name="weightUnit"
              defaultValue=""
              className={BODY_METRIC_NATIVE_SELECT_CLASS_NAME}
              aria-label="Weight unit"
            >
              <option value="">—</option>
              <option value={WeightUnit.KG}>kg</option>
              <option value={WeightUnit.LB}>lb</option>
            </select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="body-metrics-height">Height</FieldLabel>
          <FieldDescription>Pick a unit when you enter a height.</FieldDescription>
          <FieldContent className="flex flex-row flex-wrap items-stretch gap-2">
            <Input
              id="body-metrics-height"
              name="height"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 175"
              className="min-w-0 flex-1"
            />
            <select
              name="heightUnit"
              defaultValue=""
              className={BODY_METRIC_NATIVE_SELECT_CLASS_NAME}
              aria-label="Height unit"
            >
              <option value="">—</option>
              <option value={HeightUnit.CM}>cm</option>
              <option value={HeightUnit.IN}>in</option>
            </select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="body-metrics-notes">Notes</FieldLabel>
          <FieldContent className="flex flex-col gap-2">
            <Textarea
              id="body-metrics-notes"
              name="notes"
              autoComplete="off"
              placeholder="e.g. goal weight, injuries, context"
              rows={3}
            />
          </FieldContent>
        </Field>

        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" disabled={fetcher.state !== "idle"}>
          {fetcher.state !== "idle" ? "Saving…" : "Log metrics"}
        </Button>
      </FieldGroup>
    </fetcher.Form>
  );
}
