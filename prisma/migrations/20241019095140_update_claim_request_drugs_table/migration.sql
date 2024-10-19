/*
  Warnings:

  - You are about to alter the column `status` on the `ClaimRequestTreatment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `ClaimRequestDrugs` ADD COLUMN `acceptedQuantity` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `ClaimRequestTreatment` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- RedefineIndex
CREATE INDEX `ClaimRequest_claimRequestId_fkey` ON `ClaimRequestTreatment`(`claimRequestId`);
DROP INDEX `ClaimRequestTreatment_claimRequestId_fkey` ON `ClaimRequestTreatment`;
