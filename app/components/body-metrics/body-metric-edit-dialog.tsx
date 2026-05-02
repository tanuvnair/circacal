import type { FetcherWithComponents } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { HeightUnit, WeightUnit } from "../../../generated/prisma/enums";

import type { BodyMetricHistoryRow, BodyMetricsActionResult } from "./types";
import { BODY_METRIC_NATIVE_SELECT_CLASS_NAME } from "./metric-select-classname";

type MutationFetcher = FetcherWithComponents<BodyMetricsActionResult>;

export function BodyMetricEditDialog({
  row,
  open,
  onOpenChange,
  fetcher,
}: {
  row: BodyMetricHistoryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetcher: MutationFetcher;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit entry</DialogTitle>
          <DialogDescription>
            Updates this log row. To add a new measurement without changing
            history, use the form above.
          </DialogDescription>
        </DialogHeader>
        {row ? (
          <fetcher.Form
            key={row.id}
            method="post"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="_intent" value="update" />
            <input type="hidden" name="id" value={row.id} />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-weight">Weight</FieldLabel>
                <FieldContent className="flex flex-row flex-wrap items-stretch gap-2">
                  <Input
                    id="edit-weight"
                    name="weight"
                    type="text"
                    inputMode="decimal"
                    defaultValue={row.weight ?? ""}
                    className="min-w-0 flex-1"
                  />
                  <select
                    name="weightUnit"
                    defaultValue={
                      row.weight !== null
                        ? (row.weightUnit ?? WeightUnit.KG)
                        : ""
                    }
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
                <FieldLabel htmlFor="edit-height">Height</FieldLabel>
                <FieldContent className="flex flex-row flex-wrap items-stretch gap-2">
                  <Input
                    id="edit-height"
                    name="height"
                    type="text"
                    inputMode="decimal"
                    defaultValue={row.height ?? ""}
                    className="min-w-0 flex-1"
                  />
                  <select
                    name="heightUnit"
                    defaultValue={
                      row.height !== null
                        ? (row.heightUnit ?? HeightUnit.CM)
                        : ""
                    }
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
                <FieldLabel htmlFor="edit-notes">Notes</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="edit-notes"
                    name="notes"
                    rows={3}
                    defaultValue={row.notes ?? ""}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={fetcher.state !== "idle"}>
                {fetcher.state !== "idle" ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
