import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "~/db/prisma.server";
import type { HeightUnit, WeightUnit } from "../../generated/prisma/enums";

export type BodyMetricLogWrite = {
  weight: string | null;
  weightUnit: WeightUnit | null;
  height: string | null;
  heightUnit: HeightUnit | null;
  notes: string | null;
};

export type ListBodyMetricLogsParams = {
  userId: string;
  page: number;
  pageSize: number;
  createdFromUtc?: Date;
  createdToUtc?: Date;
};

export async function createBodyMetricLog(
  userId: string,
  data: BodyMetricLogWrite,
) {
  return prisma.bodyMetricLog.create({
    data: {
      userId,
      weight: data.weight,
      weightUnit: data.weightUnit,
      height: data.height,
      heightUnit: data.heightUnit,
      notes: data.notes,
    },
  });
}

export async function listBodyMetricLogs({
  userId,
  page,
  pageSize,
  createdFromUtc,
  createdToUtc,
}: ListBodyMetricLogsParams) {
  const where: Prisma.BodyMetricLogWhereInput = { userId };
  if (createdFromUtc || createdToUtc) {
    where.createdAt = {};
    if (createdFromUtc) {
      where.createdAt.gte = createdFromUtc;
    }
    if (createdToUtc) {
      where.createdAt.lte = createdToUtc;
    }
  }

  const [items, total] = await Promise.all([
    prisma.bodyMetricLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.bodyMetricLog.count({ where }),
  ]);

  return { items, total };
}

export async function updateBodyMetricLog(
  userId: string,
  id: string,
  data: BodyMetricLogWrite,
) {
  const existing = await prisma.bodyMetricLog.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return null;
  }
  return prisma.bodyMetricLog.update({
    where: { id },
    data: {
      weight: data.weight,
      weightUnit: data.weightUnit,
      height: data.height,
      heightUnit: data.heightUnit,
      notes: data.notes,
    },
  });
}

export async function deleteBodyMetricLog(userId: string, id: string) {
  const result = await prisma.bodyMetricLog.deleteMany({
    where: { id, userId },
  });
  return result.count === 1;
}
