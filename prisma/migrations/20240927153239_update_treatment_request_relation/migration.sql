/*
  Warnings:

  - You are about to drop the column `diagnosis` on the `TreatmentRequest` table. All the data in the column will be lost.
  - You are about to drop the column `enrollee` on the `TreatmentRequest` table. All the data in the column will be lost.
  - You are about to drop the column `treatments` on the `TreatmentRequest` table. All the data in the column will be lost.
  - Added the required column `enrolleeId` to the `TreatmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TreatmentRequest` DROP COLUMN `diagnosis`,
    DROP COLUMN `enrollee`,
    DROP COLUMN `treatments`,
    ADD COLUMN `enrolleeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Diagnosis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiagnosisRequests` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisRequests_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisRequests_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreatmentRequests` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreatmentRequests_AB_unique`(`A`, `B`),
    INDEX `_TreatmentRequests_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TreatmentRequest` ADD CONSTRAINT `TreatmentRequest_enrolleeId_fkey` FOREIGN KEY (`enrolleeId`) REFERENCES `Enrollee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests` ADD CONSTRAINT `_DiagnosisRequests_A_fkey` FOREIGN KEY (`A`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests` ADD CONSTRAINT `_DiagnosisRequests_B_fkey` FOREIGN KEY (`B`) REFERENCES `TreatmentRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests` ADD CONSTRAINT `_TreatmentRequests_A_fkey` FOREIGN KEY (`A`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests` ADD CONSTRAINT `_TreatmentRequests_B_fkey` FOREIGN KEY (`B`) REFERENCES `TreatmentRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
