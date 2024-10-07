/*
  Warnings:

  - Added the required column `submiterId` to the `AuthorizationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AuthorizationRequest` ADD COLUMN `submiterId` INTEGER NOT NULL,
    MODIFY `submitedBy` VARCHAR(191) NOT NULL;
