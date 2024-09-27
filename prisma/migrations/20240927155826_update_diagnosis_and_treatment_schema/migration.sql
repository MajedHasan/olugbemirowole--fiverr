/*
  Warnings:

  - You are about to drop the column `name` on the `Treatment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Diagnosis` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Treatment` DROP COLUMN `name`,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `serviceName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Diagnosis_code_key` ON `Diagnosis`(`code`);
