-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ENROLLEES', 'HOSPITAL', 'ORGANISATION', 'HMO') NOT NULL DEFAULT 'ENROLLEES',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `userId` INTEGER NULL,

    UNIQUE INDEX `Enrollee_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dependent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `enrolleeId` INTEGER NOT NULL,

    INDEX `Dependent_enrolleeId_fkey`(`enrolleeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hospital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `hospitalAddress` VARCHAR(191) NOT NULL,
    `hospitalName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `Hospital_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `HMO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `permissions` ENUM('ADMIN', 'ACCOUNT', 'CLAIMS_DEPARTMENT', 'CUSTOMER_CARE') NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `HMO_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(255) NOT NULL,
    `authorId` INTEGER NULL,

    INDEX `Post_authorId_fkey`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnosis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Diagnosis_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `isApprovalRequired` BOOLEAN NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Drugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isApprovalRequired` BOOLEAN NOT NULL,
    `group` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthorizationRequestDrugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drugId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `authorizationRequestId` INTEGER NOT NULL,

    INDEX `AuthorizationRequestDrugs_authorizationRequestId_fkey`(`authorizationRequestId`),
    INDEX `AuthorizationRequestDrugs_drugId_fkey`(`drugId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClaimRequestDrugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drugId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `authorizationRequestId` INTEGER NOT NULL,

    INDEX `ClaimRequestDrugs_authorizationRequestId_fkey`(`authorizationRequestId`),
    INDEX `ClaimRequestDrugs_drugId_fkey`(`drugId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthorizationRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `policyNo` VARCHAR(191) NOT NULL,
    `healthPlan` VARCHAR(191) NOT NULL,
    `treatmentCost` DOUBLE NOT NULL,
    `receipt` VARCHAR(191) NULL,
    `hospitalEmail` VARCHAR(191) NOT NULL,
    `hospitalPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hospitalId` INTEGER NOT NULL,
    `hospitalName` VARCHAR(191) NOT NULL,
    `enrollee` VARCHAR(191) NOT NULL,
    `submitedBy` VARCHAR(191) NOT NULL,
    `responsedBy` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `submiterId` INTEGER NOT NULL,

    INDEX `AuthorizationRequest_responsedBy_fkey`(`responsedBy`),
    INDEX `TreatmentRequest_hospitalId_fkey`(`hospitalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClaimRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `policyNo` VARCHAR(191) NOT NULL,
    `healthPlan` VARCHAR(191) NOT NULL,
    `treatmentCost` DOUBLE NOT NULL,
    `receipt` VARCHAR(191) NULL,
    `hospitalEmail` VARCHAR(191) NOT NULL,
    `hospitalPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hospitalId` INTEGER NOT NULL,
    `hospitalName` VARCHAR(191) NOT NULL,
    `enrollee` VARCHAR(191) NOT NULL,
    `submiterId` INTEGER NOT NULL,
    `submitedBy` VARCHAR(191) NOT NULL,
    `responsedBy` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACCEPTED',
    `comment` VARCHAR(191) NULL,

    INDEX `TreatmentRequest_hospitalId_fkey`(`hospitalId`),
    INDEX `ClaimRequest_responsedBy_fkey`(`responsedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiagnosisRequests_Authorization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisRequests_Authorization_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisRequests_Authorization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreatmentRequests_Authorization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreatmentRequests_Authorization_AB_unique`(`A`, `B`),
    INDEX `_TreatmentRequests_Authorization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiagnosisRequests_Claims` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisRequests_Claims_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisRequests_Claims_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreatmentRequests_Claims` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreatmentRequests_Claims_AB_unique`(`A`, `B`),
    INDEX `_TreatmentRequests_Claims_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enrollee` ADD CONSTRAINT `Enrollee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dependent` ADD CONSTRAINT `Dependent_enrolleeId_fkey` FOREIGN KEY (`enrolleeId`) REFERENCES `Enrollee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hospital` ADD CONSTRAINT `Hospital_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HMO` ADD CONSTRAINT `HMO_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationRequestDrugs` ADD CONSTRAINT `AuthorizationRequestDrugs_authorizationRequestId_fkey` FOREIGN KEY (`authorizationRequestId`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationRequestDrugs` ADD CONSTRAINT `AuthorizationRequestDrugs_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drugs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequestDrugs` ADD CONSTRAINT `ClaimRequestDrugs_authorizationRequestId_fkey` FOREIGN KEY (`authorizationRequestId`) REFERENCES `ClaimRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequestDrugs` ADD CONSTRAINT `ClaimRequestDrugs_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drugs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationRequest` ADD CONSTRAINT `AuthorizationRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationRequest` ADD CONSTRAINT `AuthorizationRequest_responsedBy_fkey` FOREIGN KEY (`responsedBy`) REFERENCES `HMO`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequest` ADD CONSTRAINT `ClaimRequest_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimRequest` ADD CONSTRAINT `ClaimRequest_responsedBy_fkey` FOREIGN KEY (`responsedBy`) REFERENCES `HMO`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Authorization` ADD CONSTRAINT `_DiagnosisRequests_Authorization_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Authorization` ADD CONSTRAINT `_DiagnosisRequests_Authorization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Authorization` ADD CONSTRAINT `_TreatmentRequests_Authorization_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthorizationRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Authorization` ADD CONSTRAINT `_TreatmentRequests_Authorization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` ADD CONSTRAINT `_DiagnosisRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisRequests_Claims` ADD CONSTRAINT `_DiagnosisRequests_Claims_B_fkey` FOREIGN KEY (`B`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Claims` ADD CONSTRAINT `_TreatmentRequests_Claims_A_fkey` FOREIGN KEY (`A`) REFERENCES `ClaimRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreatmentRequests_Claims` ADD CONSTRAINT `_TreatmentRequests_Claims_B_fkey` FOREIGN KEY (`B`) REFERENCES `Treatment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
