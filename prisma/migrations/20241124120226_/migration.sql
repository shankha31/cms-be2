/*
  Warnings:

  - You are about to alter the column `startDate` on the `eventdetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `eventdetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `eventdetail` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;

-- DropTable
DROP TABLE `message`;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_user` INTEGER NOT NULL,
    `to_user` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `messages_from_user_foreign`(`from_user`),
    INDEX `messages_to_user_foreign`(`to_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_from_user_foreign` FOREIGN KEY (`from_user`) REFERENCES `UserProfile`(`userProfileId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_to_user_foreign` FOREIGN KEY (`to_user`) REFERENCES `UserProfile`(`userProfileId`) ON DELETE CASCADE ON UPDATE NO ACTION;
