import type { Estimate } from "../../generated/prisma/enums";
import { prisma } from "~/db/prisma.server";

export async function upsertDailyEnergyRecord(
  userId: string,
  date: Date,
  energyEstimate: Estimate,
) {
  return prisma.dailyEnergyRecord.upsert({
    where: {
      userId_date: { userId, date },
    },
    create: { userId, date, energyEstimate },
    update: { energyEstimate },
  });
}

export async function findDailyEnergyRecordForUserDate(
  userId: string,
  date: Date,
) {
  return prisma.dailyEnergyRecord.findUnique({
    where: {
      userId_date: { userId, date },
    },
  });
}
