-- AddForeignKey
ALTER TABLE `AuthorizationRequest` ADD CONSTRAINT `AuthorizationRequest_responsedBy_fkey` FOREIGN KEY (`responsedBy`) REFERENCES `HMO`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
