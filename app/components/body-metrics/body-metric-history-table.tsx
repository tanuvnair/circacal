import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "~/components/ui/button";

import type { BodyMetricHistoryRow } from "./types";

export function BodyMetricHistoryTable({
  rows,
  tableCaptionId,
  onEdit,
  onDelete,
}: {
  rows: BodyMetricHistoryRow[];
  tableCaptionId: string;
  onEdit: (row: BodyMetricHistoryRow) => void;
  onDelete: (row: BodyMetricHistoryRow) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-border">
      <table
        className="w-full min-w-[36rem] border-collapse text-sm"
        aria-labelledby={tableCaptionId}
      >
        <caption id={tableCaptionId} className="sr-only">
          Body metric history
        </caption>
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th scope="col" className="px-3 py-2 font-medium">
              Logged
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Weight
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Height
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Notes
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-3 py-6 text-center text-muted-foreground"
              >
                No rows match these filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-3 py-2 align-top whitespace-nowrap">
                  {row.loggedAtLabel}
                </td>
                <td className="px-3 py-2 align-top">
                  {row.weight !== null
                    ? `${row.weight} ${row.weightUnit?.toLowerCase() ?? ""}`
                    : "—"}
                </td>
                <td className="px-3 py-2 align-top">
                  {row.height !== null
                    ? `${row.height} ${row.heightUnit?.toLowerCase() ?? ""}`
                    : "—"}
                </td>
                <td
                  className="max-w-[12rem] px-3 py-2 align-top break-words sm:max-w-xs"
                  title={row.notes ?? undefined}
                >
                  {row.notes?.length ? row.notes : "—"}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex flex-row flex-wrap gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="shrink-0"
                      aria-label="Edit entry"
                      onClick={() => {
                        onEdit(row);
                      }}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="shrink-0"
                      aria-label="Delete entry"
                      onClick={() => {
                        onDelete(row);
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
