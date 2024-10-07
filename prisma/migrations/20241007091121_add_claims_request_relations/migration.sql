/*
  Warnings:

  - You are about to drop the `_DiagnosisRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DrugsRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TreatmentRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DiagnosisRequests` DROP FOREIGN KEY `_DiagnosisRequests_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DiagnosisRequests` DROP FOREIGN KEY `_DiagnosisRequests_B_fkey`;

-- DropForeignKey
ALTER TABLE `_DrugsRequests` DROP FOREIGN KEY `_DrugsRequests_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DrugsRequests` DROP FOREIGN KEY `_DrugsRequests_B_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests` DROP FOREIGN KEY `_TreatmentRequests_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TreatmentRequests` DROP FOREIGN KEY `_TreatmentRequests_B_fkey`;

-- DropTable
DROP TABLE `_DiagnosisRequests`;

-- DropTable
DROP TABLE `_DrugsRequests`;

-- DropTable
DROP TABLE `_TreatmentRequests`;

-- CreateTable
CREATE TABLE `ClaimsRequest` (
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
CREATE TABLE `_DiagnosisRequests_Authorization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisRequests_Authorization_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisRequests_Authorization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreatmentRequests_Authorization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreatmentRequests_Authorization_AB_unique`(`A`, `B`),
    INDEX `_TreatmentRequests_Authorization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DrugsRequests_Authorization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DrugsRequests_Authorization_AB_unique`(`A`, `B`),
    INDEX `_DrugsRequests_Authorization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiagnosisRequests_Claims` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisRequests_Claims_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisRequests_Claims_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreatmentRequests_Claims` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreatmentRequests_Claims_AB_unique`(`A`, `B`),
    INDEX `_TreatmentRequests_Claims_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DrugsRequests_Claims` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DrugsRequests_Claims_AB_unique`(`A`, `B`),
    INDEX `_DrugsRequests_Claims_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClaimsRequest` ADD CONSTRAINT `ClaimsRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Authorization` ADD CONSTRAINT `_DiagnosisRequests_Authorization_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Authorization` ADD CONSTRAINT `_DiagnosisRequests_Authorization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Authorization` ADD CONSTRAINT `_TreatmentRequests_Authorization_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Authorization` ADD CONSTRAINT `_TreatmentRequests_Authorization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests_Authorization` ADD CONSTRAINT `_DrugsRequests_Authorization_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests_Authorization` ADD CONSTRAINT `_DrugsRequests_Authorization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Drugs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` ADD CONSTRAINT `_DiagnosisRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimsRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` ADD CONSTRAINT `_DiagnosisRequests_Claims_B_fkey` FOREIGN KEY (`B`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Claims` ADD CONSTRAINT `_TreatmentRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimsRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Claims` ADD CONSTRAINT `_TreatmentRequests_Claims_B_fkey` FOREIGN KEY (`B`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests_Claims` ADD CONSTRAINT `_DrugsRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimsRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DrugsRequests_Claims` ADD CONSTRAINT `_DrugsRequests_Claims_B_fkey` FOREIGN KEY (`B`) REFERENCES `Drugs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
