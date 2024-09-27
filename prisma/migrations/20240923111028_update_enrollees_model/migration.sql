/*
  Warnings:

  - You are about to drop the `Enrollees` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `HMO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HMO` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Hospital` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ENROLLEES', 'HOSPITAL', 'ORGANISATION', 'HMO') NOT NULL DEFAULT 'ENROLLEES';

-- DropTable
DROP TABLE `Enrollees`;

-- CreateTable
CREATE TABLE `Enrollee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `policyNo` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `planType` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `hospital` VARCHAR(191) NOT NULL,
    `noOfDependents` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Enrollee_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dependent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `enrolleeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dependent` ADD CONSTRAINT `Dependent_enrolleeId_fkey` FOREIGN KEY (`enrolleeId`) REFERENCES `Enrollee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
