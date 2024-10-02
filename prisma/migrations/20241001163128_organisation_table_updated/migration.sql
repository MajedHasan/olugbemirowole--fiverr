-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
