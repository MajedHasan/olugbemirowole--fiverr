/*
  Warnings:

  - You are about to drop the column `name` on the `HMO` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Hospital` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `HMO` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `HMO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissions` to the `HMO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `HMO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalAddress` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalName` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Enrollee` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `HMO` DROP COLUMN `name`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `permissions` ENUM('ADMIN', 'ACCOUNT', 'CLAIMS_DEPARTMENT', 'CUSTOMER_CARE') NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Hospital` DROP COLUMN `name`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `hospitalAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `hospitalName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Organisation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `companyID` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `clientServiceOfficer` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `Organisation_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `HMO_userId_key` ON `HMO`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Hospital_userId_key` ON `Hospital`(`userId`);
