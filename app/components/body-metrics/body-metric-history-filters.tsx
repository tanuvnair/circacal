import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { Field, FieldContent, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  endOfZonedCalendarDayUtc,
  startOfZonedCalendarDayUtc,
} from "~/lib/zoned-wall-time";

import { bodyMetricListSearchString } from "./list-search-string";
import { BODY_METRIC_NATIVE_SELECT_CLASS_NAME } from "./metric-select-classname";

export function BodyMetricHistoryFilters({
  datePickerFrom,
  datePickerTo,
  pageSize,
  timeZone,
}: {
  datePickerFrom: string | null;
  datePickerTo: string | null;
  pageSize: number;
  timeZone: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const clearSearch = bodyMetricListSearchString({
    page: 1,
    pageSize,
    dateFromIso: null,
    dateToIso: null,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const el = event.currentTarget;
    const dayFrom = (el.elements.namedItem("dateFromDay") as HTMLInputElement)
      .value;
    const dayTo = (el.elements.namedItem("dateToDay") as HTMLInputElement)
      .value;
    const size = (el.elements.namedItem("pageSize") as HTMLSelectElement).value;

    const p = new URLSearchParams();
    if (dayFrom) {
      const start = startOfZonedCalendarDayUtc(dayFrom, timeZone);
      if (start) {
        p.set("dateFrom", start.toISOString());
      }
    }
    if (dayTo) {
      const end = endOfZonedCalendarDayUtc(dayTo, timeZone);
      if (end) {
        p.set("dateTo", end.toISOString());
      }
    }
    if (size && size !== "10") {
      p.set("pageSize", size);
    }

    const qs = p.toString();
    navigate(
      {
        pathname: location.pathname,
        search: qs ? `?${qs}` : "",
      },
      { replace: true },
    );
  }

  return (
    <form
      key={`${datePickerFrom ?? ""}|${datePickerTo ?? ""}|${pageSize}`}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
      onSubmit={handleSubmit}
    >
      <Field className="min-w-0 flex-1 sm:max-w-[12rem]">
        <FieldLabel htmlFor="filter-date-from">From</FieldLabel>
        <FieldContent>
          <Input
            id="filter-date-from"
            name="dateFromDay"
            type="date"
            defaultValue={datePickerFrom ?? ""}
          />
        </FieldContent>
      </Field>
      <Field className="min-w-0 flex-1 sm:max-w-[12rem]">
        <FieldLabel htmlFor="filter-date-to">To</FieldLabel>
        <FieldContent>
          <Input
            id="filter-date-to"
            name="dateToDay"
            type="date"
            defaultValue={datePickerTo ?? ""}
          />
        </FieldContent>
      </Field>
      <Field className="min-w-0 flex-1 sm:max-w-[10rem]">
        <FieldLabel htmlFor="filter-page-size">Per page</FieldLabel>
        <FieldContent>
          <select
            id="filter-page-size"
            name="pageSize"
            defaultValue={String(pageSize)}
            className={cn(
              BODY_METRIC_NATIVE_SELECT_CLASS_NAME,
              "w-full min-w-0",
            )}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </FieldContent>
      </Field>
      <div className="flex flex-row flex-wrap gap-2">
        <Button type="submit" variant="secondary">
          Apply filters
        </Button>
        <Button variant="outline" asChild>
          <Link to={clearSearch} replace>
            Clear dates
          </Link>
        </Button>
      </div>
    </form>
  );
}
