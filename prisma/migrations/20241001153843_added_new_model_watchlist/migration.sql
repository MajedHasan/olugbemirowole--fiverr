-- AddForeignKey
ALTER TABLE `Enrollee` ADD CONSTRAINT `Enrollee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
