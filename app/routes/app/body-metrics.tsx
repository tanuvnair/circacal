import { useEffect, useId, useState } from "react";
import { redirect, useFetcher, useLoaderData } from "react-router";

import type { Route } from "./+types/body-metrics";
import { Separator } from "~/components/ui/separator";
import {
  BodyMetricCreateForm,
  BodyMetricDeleteDialog,
  BodyMetricEditDialog,
  BodyMetricHistorySection,
  BodyMetricLogSuccessAlert,
  BodyMetricsHeader,
  type BodyMetricHistoryRow,
  type BodyMetricsActionResult,
} from "~/components/body-metrics";
import {
  createBodyMetricLog,
  deleteBodyMetricLog,
  listBodyMetricLogs,
  updateBodyMetricLog,
} from "~/db-repositories/body-metric-log.repository.server";
import { findUserById } from "~/db-repositories/user.repository.server";
import { getSession } from "~/lib/auth.server";
import { resolveStoredTimeZone } from "~/lib/user-time-zone";
import {
  parseCreateBodyMetricFromFormData,
  parseDeleteBodyMetricFromFormData,
  parsePageParams,
  parseUpdateBodyMetricFromFormData,
} from "~/components/body-metrics/body-metrics.server";
import {
  parseBodyMetricFilterInstant,
  utcInstantToZonedDateOnly,
} from "~/lib/zoned-wall-time";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const user = await findUserById(session.user.id);
  const timeZone = resolveStoredTimeZone(user?.timeZone);

  const url = new URL(request.url);
  const { page, pageSize } = parsePageParams(url);

  const rawDateFrom = url.searchParams.get("dateFrom");
  const rawDateTo = url.searchParams.get("dateTo");

  let fromInstant = parseBodyMetricFilterInstant(
    rawDateFrom,
    false,
    timeZone,
  );
  let toInstant = parseBodyMetricFilterInstant(rawDateTo, true, timeZone);

  if (
    fromInstant &&
    toInstant &&
    fromInstant.getTime() > toInstant.getTime()
  ) {
    const swap = fromInstant;
    fromInstant = toInstant;
    toInstant = swap;
  }

  const dateFromIso = fromInstant ? fromInstant.toISOString() : null;
  const dateToIso = toInstant ? toInstant.toISOString() : null;
  const datePickerFrom = fromInstant
    ? utcInstantToZonedDateOnly(fromInstant, timeZone)
    : null;
  const datePickerTo = toInstant
    ? utcInstantToZonedDateOnly(toInstant, timeZone)
    : null;

  const { items, total } = await listBodyMetricLogs({
    userId: session.user.id,
    page,
    pageSize,
    createdFromUtc: fromInstant,
    createdToUtc: toInstant,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (page > totalPages) {
    const next = new URL(request.url);
    next.searchParams.set("page", String(totalPages));
    throw redirect(`${next.pathname}${next.search}`);
  }

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });

  const rows: BodyMetricHistoryRow[] = items.map((row) => ({
    id: row.id,
    weight: row.weight?.toString() ?? null,
    weightUnit: row.weightUnit,
    height: row.height?.toString() ?? null,
    heightUnit: row.heightUnit,
    notes: row.notes,
    loggedAtLabel: dateFmt.format(row.createdAt),
  }));

  return {
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
  };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<BodyMetricsActionResult> {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "create");

  if (intent === "delete") {
    const parsed = parseDeleteBodyMetricFromFormData(formData);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    const removed = await deleteBodyMetricLog(session.user.id, parsed.data.id);
    if (!removed) {
      return { ok: false, error: "Entry not found or already removed." };
    }
    return { ok: true };
  }

  if (intent === "update") {
    const parsed = parseUpdateBodyMetricFromFormData(formData);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    const { id, ...rest } = parsed.data;
    const updated = await updateBodyMetricLog(session.user.id, id, rest);
    if (!updated) {
      return { ok: false, error: "Entry not found." };
    }
    return { ok: true };
  }

  const parsed = parseCreateBodyMetricFromFormData(formData);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }
  await createBodyMetricLog(session.user.id, parsed.data);
  return { ok: true };
}

export function meta() {
  return [{ title: "Body metrics - CircaCal" }];
}

export default function BodyMetrics() {
  const {
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
  } = useLoaderData<typeof loader>();

  const tableCaptionId = useId();
  const createFetcher = useFetcher<typeof action>();
  const mutationFetcher = useFetcher<typeof action>();

  const [createFormKey, setCreateFormKey] = useState(0);
  const [editRow, setEditRow] = useState<BodyMetricHistoryRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<BodyMetricHistoryRow | null>(null);

  const createError =
    createFetcher.data && "ok" in createFetcher.data && !createFetcher.data.ok
      ? createFetcher.data.error
      : null;
  const createSuccess =
    createFetcher.state === "idle" &&
    createFetcher.data !== undefined &&
    "ok" in createFetcher.data &&
    createFetcher.data.ok;

  const mutationError =
    mutationFetcher.data &&
    "ok" in mutationFetcher.data &&
    !mutationFetcher.data.ok
      ? mutationFetcher.data.error
      : null;

  useEffect(() => {
    if (
      createFetcher.state === "idle" &&
      createFetcher.data &&
      "ok" in createFetcher.data &&
      createFetcher.data.ok
    ) {
      setCreateFormKey((k) => k + 1);
    }
  }, [createFetcher.state, createFetcher.data]);

  useEffect(() => {
    if (
      mutationFetcher.state === "idle" &&
      mutationFetcher.data &&
      "ok" in mutationFetcher.data &&
      mutationFetcher.data.ok
    ) {
      setEditRow(null);
      setDeleteRow(null);
    }
  }, [mutationFetcher.state, mutationFetcher.data]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <BodyMetricsHeader />

      {createSuccess ? <BodyMetricLogSuccessAlert /> : null}

      <BodyMetricCreateForm
        fetcher={createFetcher}
        formKey={createFormKey}
        errorMessage={createError}
      />

      <Separator />

      <BodyMetricHistorySection
        rows={rows}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        dateFromIso={dateFromIso}
        dateToIso={dateToIso}
        datePickerFrom={datePickerFrom}
        datePickerTo={datePickerTo}
        timeZone={timeZone}
        tableCaptionId={tableCaptionId}
        onEdit={setEditRow}
        onDelete={setDeleteRow}
      />

      <BodyMetricEditDialog
        row={editRow}
        open={editRow !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditRow(null);
          }
        }}
        fetcher={mutationFetcher}
        errorMessage={editRow !== null ? mutationError : null}
      />

      <BodyMetricDeleteDialog
        row={deleteRow}
        open={deleteRow !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteRow(null);
          }
        }}
        fetcher={mutationFetcher}
        errorMessage={deleteRow !== null ? mutationError : null}
      />
    </div>
  );
}
