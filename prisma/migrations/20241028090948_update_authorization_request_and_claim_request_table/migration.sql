-- AlterTable
ALTER TABLE `AuthorizationRequest` ADD COLUMN `authorizationCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ClaimRequest` ADD COLUMN `authorizationCode` VARCHAR(191) NULL;
