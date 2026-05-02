import type { BodyMetricHistoryRow } from "./types";
import { BodyMetricHistoryFilters } from "./body-metric-history-filters";
import { BodyMetricHistoryPagination } from "./body-metric-history-pagination";
import { BodyMetricHistoryTable } from "./body-metric-history-table";
import { bodyMetricListSearchString } from "./list-search-string";

export function BodyMetricHistorySection({
  rows,
  total,
  page,
  pageSize,
  totalPages,
  dateFromIso,
  dateToIso,
  datePickerFrom,
  datePickerTo,
  timeZone,
  tableCaptionId,
  mutationError,
  onEdit,
  onDelete,
}: {
  rows: BodyMetricHistoryRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dateFromIso: string | null;
  dateToIso: string | null;
  datePickerFrom: string | null;
  datePickerTo: string | null;
  timeZone: string;
  tableCaptionId: string;
  mutationError: string | null;
  onEdit: (row: BodyMetricHistoryRow) => void;
  onDelete: (row: BodyMetricHistoryRow) => void;
}) {
  const filterBase = { pageSize, dateFromIso, dateToIso };
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const previousTo = bodyMetricListSearchString({
    ...filterBase,
    page: Math.max(1, page - 1),
  });
  const nextTo = bodyMetricListSearchString({
    ...filterBase,
    page: Math.min(totalPages, page + 1),
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          History
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
          Date range uses your saved time zone ({timeZone}). Query parameters
          dateFrom and dateTo are ISO UTC instants (for example
          2026-04-30T18:30:00.000Z).
        </p>
      </div>

      <BodyMetricHistoryFilters
        datePickerFrom={datePickerFrom}
        datePickerTo={datePickerTo}
        pageSize={pageSize}
        timeZone={timeZone}
      />

      {mutationError ? (
        <p className="text-sm text-destructive" role="alert">
          {mutationError}
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">
        {total === 0
          ? "No entries yet."
          : `Showing ${startItem}–${endItem} of ${total}`}
      </p>

      <BodyMetricHistoryTable
        rows={rows}
        tableCaptionId={tableCaptionId}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {total > 0 ? (
        <BodyMetricHistoryPagination
          page={page}
          totalPages={totalPages}
          previousTo={previousTo}
          nextTo={nextTo}
        />
      ) : null}
    </div>
  );
}
