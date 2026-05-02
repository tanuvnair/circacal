import { z } from "zod";

import { HeightUnit, WeightUnit } from "../../../generated/prisma/enums";

const DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/;
const MAX_METRIC = 9999.99;

const optionalTrimmed = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s));

const optionalMetricString = optionalTrimmed.pipe(
  z
    .union([z.null(), z.string()])
    .refine(
      (v) => v === null || (DECIMAL_REGEX.test(v) && Number(v) <= MAX_METRIC),
      "Enter a number up to 9999.99 with at most two decimal places.",
    ),
);

const optionalNotes = optionalTrimmed.pipe(
  z.union([z.null(), z.string().max(2000, "Notes are too long.")]),
);

const weightUnitSchema = z.enum([WeightUnit.KG, WeightUnit.LB]);
const heightUnitSchema = z.enum([HeightUnit.CM, HeightUnit.IN]);

const baseFields = z.object({
  weight: optionalMetricString,
  weightUnit: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? null : v),
    z.union([z.null(), weightUnitSchema]),
  ),
  height: optionalMetricString,
  heightUnit: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? null : v),
    z.union([z.null(), heightUnitSchema]),
  ),
  notes: optionalNotes,
});

const withMetricRule = baseFields.superRefine((data, ctx) => {
  const hasWeight = data.weight !== null;
  const hasHeight = data.height !== null;
  const hasNotes = data.notes !== null && data.notes.length > 0;
  if (!hasWeight && !hasHeight && !hasNotes) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter at least weight, height, or notes.",
    });
  }
  if (hasWeight && data.weightUnit === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["weightUnit"],
      message: "Choose a weight unit.",
    });
  }
  if (!hasWeight && data.weightUnit !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["weightUnit"],
      message: "Clear the unit or enter a weight.",
    });
  }
  if (hasHeight && data.heightUnit === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["heightUnit"],
      message: "Choose a height unit.",
    });
  }
  if (!hasHeight && data.heightUnit !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["heightUnit"],
      message: "Clear the unit or enter a height.",
    });
  }
});

export const createBodyMetricSchema = withMetricRule;

export const updateBodyMetricSchema = z
  .object({
    id: z.string().min(1, "Missing entry id."),
  })
  .and(withMetricRule);

export type ParsedBodyMetricPayload = z.infer<typeof createBodyMetricSchema>;

function formatZodError(err: z.ZodError): string {
  return err.issues.map((i) => i.message).join(" ");
}

function stringOrNull(form: FormData, key: string): string | null {
  const v = form.get(key);
  if (typeof v !== "string") {
    return null;
  }
  return v;
}

export function parseCreateBodyMetricFromFormData(formData: FormData):
  | { ok: true; data: ParsedBodyMetricPayload }
  | { ok: false; error: string } {
  const raw = {
    weight: String(formData.get("weight") ?? ""),
    weightUnit: stringOrNull(formData, "weightUnit"),
    height: String(formData.get("height") ?? ""),
    heightUnit: stringOrNull(formData, "heightUnit"),
    notes: String(formData.get("notes") ?? ""),
  };
  const parsed = createBodyMetricSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }
  return { ok: true, data: parsed.data };
}

export function parseUpdateBodyMetricFromFormData(formData: FormData):
  | { ok: true; data: z.infer<typeof updateBodyMetricSchema> }
  | { ok: false; error: string } {
  const raw = {
    id: String(formData.get("id") ?? ""),
    weight: String(formData.get("weight") ?? ""),
    weightUnit: stringOrNull(formData, "weightUnit"),
    height: String(formData.get("height") ?? ""),
    heightUnit: stringOrNull(formData, "heightUnit"),
    notes: String(formData.get("notes") ?? ""),
  };
  const parsed = updateBodyMetricSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }
  return { ok: true, data: parsed.data };
}

export function parseDeleteBodyMetricFromFormData(formData: FormData):
  | { ok: true; data: { id: string } }
  | { ok: false; error: string } {
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false, error: "Missing entry id." };
  }
  return { ok: true, data: { id } };
}

export function parsePageParams(url: URL): {
  page: number;
  pageSize: number;
} {
  const pageRaw = url.searchParams.get("page");
  const pageSizeRaw = url.searchParams.get("pageSize");
  let page = pageRaw ? parseInt(pageRaw, 10) : 1;
  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }
  let pageSize = pageSizeRaw ? parseInt(pageSizeRaw, 10) : 10;
  if (!Number.isFinite(pageSize) || pageSize < 1) {
    pageSize = 10;
  }
  pageSize = Math.min(pageSize, 50);
  return {
    page,
    pageSize,
  };
}
