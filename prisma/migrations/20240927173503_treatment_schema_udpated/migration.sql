/*
  Warnings:

  - You are about to drop the column `enrolleeName` on the `TreatmentRequest` table. All the data in the column will be lost.
  - Added the required column `enrollee` to the `TreatmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TreatmentRequest` DROP COLUMN `enrolleeName`,
    ADD COLUMN `enrollee` VARCHAR(191) NOT NULL;
