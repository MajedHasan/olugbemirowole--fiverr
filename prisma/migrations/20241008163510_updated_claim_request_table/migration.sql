/*
  Warnings:

  - You are about to drop the column `authorizationRequestId` on the `ClaimRequestDrugs` table. All the data in the column will be lost.
  - Added the required column `claimRequestId` to the `ClaimRequestDrugs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ClaimRequestDrugs` DROP FOREIGN KEY `ClaimRequestDrugs_authorizationRequestId_fkey`;

-- AlterTable
ALTER TABLE `ClaimRequestDrugs` DROP COLUMN `authorizationRequestId`,
    ADD COLUMN `claimRequestId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `ClaimRequestDrugs_claimRequestId_fkey` ON `ClaimRequestDrugs`(`claimRequestId`);

-- AddForeignKey
ALTER TABLE `ClaimRequestDrugs` ADD CONSTRAINT `ClaimRequestDrugs_claimRequestId_fkey` FOREIGN KEY (`claimRequestId`) REFERENCES `ClaimRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
