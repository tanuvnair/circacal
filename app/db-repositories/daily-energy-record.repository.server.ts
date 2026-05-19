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

/**
 * Returns all daily energy records for a user within [from, to] (inclusive).
 * Results are ordered oldest → newest so callers can iterate chronologically.
 */
export async function listDailyEnergyRecordsInRange(
  userId: string,
  from: Date,
  to: Date,
) {
  return prisma.dailyEnergyRecord.findMany({
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    orderBy: { date: "asc" },
  });
}

/**
 * Counts how many consecutive calendar days (ending at `todayUtcMidnight`)
 * have a logged energy record. Fetches recent records and walks backward.
 */
export async function countConsecutiveStreakDays(
  userId: string,
  todayUtcMidnight: Date,
): Promise<number> {
  // Fetch the last 365 records (more than enough) newest first
  const rows = await prisma.dailyEnergyRecord.findMany({
    where: {
      userId,
      date: { lte: todayUtcMidnight },
    },
    orderBy: { date: "desc" },
    take: 365,
    select: { date: true },
  });

  if (rows.length === 0) return 0;

  const ONE_DAY_MS = 86_400_000;
  let streak = 0;
  let expected = todayUtcMidnight.getTime();

  for (const row of rows) {
    const rowMs = row.date.getTime();
    if (rowMs === expected) {
      streak++;
      expected -= ONE_DAY_MS;
    } else if (rowMs < expected) {
      // Gap found — streak ends
      break;
    }
    // rowMs > expected shouldn't happen with lte filter, but skip if so
  }

  return streak;
}
