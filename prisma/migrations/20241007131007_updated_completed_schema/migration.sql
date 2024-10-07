/*
  Warnings:

  - You are about to drop the `_DrugsRequests_Authorization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DrugsRequests_Authorization` DROP FOREIGN KEY `_DrugsRequests_Authorization_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DrugsRequests_Authorization` DROP FOREIGN KEY `_DrugsRequests_Authorization_B_fkey`;

-- DropTable
DROP TABLE `_DrugsRequests_Authorization`;

-- CreateTable
CREATE TABLE `AuthorizationRequestDrugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drugId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `authorizationRequestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuthorizationRequestDrugs` ADD CONSTRAINT `AuthorizationRequestDrugs_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drugs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationRequestDrugs` ADD CONSTRAINT `AuthorizationRequestDrugs_authorizationRequestId_fkey` FOREIGN KEY (`authorizationRequestId`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
