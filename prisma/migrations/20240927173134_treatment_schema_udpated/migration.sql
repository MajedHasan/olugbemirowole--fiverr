/*
  Warnings:

  - You are about to drop the column `enrolleeId` on the `TreatmentRequest` table. All the data in the column will be lost.
  - You are about to drop the column `hospital` on the `TreatmentRequest` table. All the data in the column will be lost.
  - Added the required column `enrolleeName` to the `TreatmentRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `TreatmentRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalName` to the `TreatmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TreatmentRequest` DROP FOREIGN KEY `TreatmentRequest_enrolleeId_fkey`;

-- AlterTable
ALTER TABLE `TreatmentRequest` DROP COLUMN `enrolleeId`,
    DROP COLUMN `hospital`,
    ADD COLUMN `enrolleeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `hospitalId` INTEGER NOT NULL,
    ADD COLUMN `hospitalName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TreatmentRequest` ADD CONSTRAINT `TreatmentRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
