/*
  Warnings:

  - You are about to drop the `ClaimsRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DrugsRequests_Claims` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ClaimsRequest` DROP FOREIGN KEY `ClaimsRequest_hospitalId_fkey`;

-- DropForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` DROP FOREIGN KEY `_DiagnosisRequests_Claims_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DrugsRequests_Claims` DROP FOREIGN KEY `_DrugsRequests_Claims_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DrugsRequests_Claims` DROP FOREIGN KEY `_DrugsRequests_Claims_B_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests_Claims` DROP FOREIGN KEY `_TreatmentRequests_Claims_A_fkey`;

-- DropTable
DROP TABLE `ClaimsRequest`;

-- DropTable
DROP TABLE `_DrugsRequests_Claims`;

-- CreateTable
CREATE TABLE `ClaimRequestDrugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drugId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `authorizationRequestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClaimRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `policyNo` VARCHAR(191) NOT NULL,
    `healthPlan` VARCHAR(191) NOT NULL,
    `treatmentCost` DOUBLE NOT NULL,
    `receipt` VARCHAR(191) NULL,
    `hospitalEmail` VARCHAR(191) NOT NULL,
    `hospitalPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hospitalId` INTEGER NOT NULL,
    `hospitalName` VARCHAR(191) NOT NULL,
    `enrollee` VARCHAR(191) NOT NULL,
    `submiterId` INTEGER NOT NULL,
    `submitedBy` VARCHAR(191) NOT NULL,
    `responsedBy` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACCEPTED',

    INDEX `TreatmentRequest_hospitalId_fkey`(`hospitalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClaimRequestDrugs` ADD CONSTRAINT `ClaimRequestDrugs_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drugs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequestDrugs` ADD CONSTRAINT `ClaimRequestDrugs_authorizationRequestId_fkey` FOREIGN KEY (`authorizationRequestId`) REFERENCES `ClaimRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequest` ADD CONSTRAINT `ClaimRequest_responsedBy_fkey` FOREIGN KEY (`responsedBy`) REFERENCES `HMO`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequest` ADD CONSTRAINT `ClaimRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` ADD CONSTRAINT `_DiagnosisRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Claims` ADD CONSTRAINT `_TreatmentRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
