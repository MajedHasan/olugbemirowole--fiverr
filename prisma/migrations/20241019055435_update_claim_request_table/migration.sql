/*
  Warnings:

  - You are about to drop the `_TreatmentRequests_Claims` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TreatmentRequests_Claims` DROP FOREIGN KEY `_TreatmentRequests_Claims_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests_Claims` DROP FOREIGN KEY `_TreatmentRequests_Claims_B_fkey`;

-- AlterTable
ALTER TABLE `ClaimRequest` ADD COLUMN `acceptedCost` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `rejectedCost` DOUBLE NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `_TreatmentRequests_Claims`;

-- CreateTable
CREATE TABLE `ClaimRequestTreatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `claimRequestId` INTEGER NOT NULL,
    `treatmentId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    INDEX `ClaimRequestTreatment_claimRequestId_fkey`(`claimRequestId`),
    INDEX `ClaimRequestTreatment_treatmentId_fkey`(`treatmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClaimRequestTreatment` ADD CONSTRAINT `ClaimRequestTreatment_claimRequestId_fkey` FOREIGN KEY (`claimRequestId`) REFERENCES `ClaimRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequestTreatment` ADD CONSTRAINT `ClaimRequestTreatment_treatmentId_fkey` FOREIGN KEY (`treatmentId`) REFERENCES `Treatment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
