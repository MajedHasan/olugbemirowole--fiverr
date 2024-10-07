/*
  Warnings:

  - You are about to drop the column `serviceName` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the `TreatmentRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isApprovalRequired` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TreatmentRequest` DROP FOREIGN KEY `TreatmentRequest_hospitalId_fkey`;

-- DropForeignKey
ALTER TABLE `_DiagnosisRequests` DROP FOREIGN KEY `_DiagnosisRequests_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DiagnosisRequests` DROP FOREIGN KEY `_DiagnosisRequests_B_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests` DROP FOREIGN KEY `_TreatmentRequests_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests` DROP FOREIGN KEY `_TreatmentRequests_B_fkey`;

-- AlterTable
ALTER TABLE `Treatment` DROP COLUMN `serviceName`,
    ADD COLUMN `isApprovalRequired` BOOLEAN NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `TreatmentRequest`;

-- CreateTable
CREATE TABLE `Drugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isApprovalRequired` BOOLEAN NOT NULL,
    `group` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthorizationRequest` (
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
    `submitedBy` INTEGER NOT NULL,
    `responsedBy` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    INDEX `TreatmentRequest_hospitalId_fkey`(`hospitalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DrugsRequests` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DrugsRequests_AB_unique`(`A`, `B`),
    INDEX `_DrugsRequests_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuthorizationRequest` ADD CONSTRAINT `AuthorizationRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests` ADD CONSTRAINT `_DiagnosisRequests_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests` ADD CONSTRAINT `_DiagnosisRequests_B_fkey` FOREIGN KEY (`B`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests` ADD CONSTRAINT `_TreatmentRequests_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests` ADD CONSTRAINT `_TreatmentRequests_B_fkey` FOREIGN KEY (`B`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests` ADD CONSTRAINT `_DrugsRequests_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests` ADD CONSTRAINT `_DrugsRequests_B_fkey` FOREIGN KEY (`B`) REFERENCES `Drugs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
