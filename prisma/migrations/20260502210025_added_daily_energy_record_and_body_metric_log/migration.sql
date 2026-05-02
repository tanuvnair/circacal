-- CreateEnum
CREATE TYPE "Estimate" AS ENUM ('deficit', 'maintenance', 'surplus');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('kg', 'lb');

-- CreateEnum
CREATE TYPE "HeightUnit" AS ENUM ('cm', 'in');

-- CreateTable
CREATE TABLE "daily_energy_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "energyEstimate" "Estimate" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_energy_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_metric_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" DECIMAL(6,2),
    "weightUnit" "WeightUnit",
    "height" DECIMAL(6,2),
    "heightUnit" "HeightUnit",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "body_metric_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_energy_records_userId_date_key" ON "daily_energy_records"("userId", "date");

-- CreateIndex
CREATE INDEX "body_metric_logs_userId_createdAt_idx" ON "body_metric_logs"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "daily_energy_records" ADD CONSTRAINT "daily_energy_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_metric_logs" ADD CONSTRAINT "body_metric_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
