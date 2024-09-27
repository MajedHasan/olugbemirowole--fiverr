-- CreateTable
CREATE TABLE `TreatmentRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollee` VARCHAR(191) NOT NULL,
    `policyNo` VARCHAR(191) NOT NULL,
    `healthPlan` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NOT NULL,
    `treatmentCost` DOUBLE NOT NULL,
    `receipt` VARCHAR(191) NULL,
    `hospital` VARCHAR(191) NOT NULL,
    `hospitalEmail` VARCHAR(191) NOT NULL,
    `hospitalPhone` VARCHAR(191) NULL,
    `treatments` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
