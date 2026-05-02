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

import type { BodyMetricHistoryRow, BodyMetricsActionResult } from "./types";

type MutationFetcher = FetcherWithComponents<BodyMetricsActionResult>;

export function BodyMetricDeleteDialog({
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
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete this entry?</DialogTitle>
          <DialogDescription>
            This removes the log from your history. It cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {row ? (
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_intent" value="delete" />
            <input type="hidden" name="id" value={row.id} />
            <p className="text-sm text-muted-foreground">
              Logged {row.loggedAtLabel}
              {row.weight !== null
                ? ` · ${row.weight} ${row.weightUnit?.toLowerCase() ?? ""}`
                : ""}
            </p>
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
              <Button
                type="submit"
                variant="destructive"
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
