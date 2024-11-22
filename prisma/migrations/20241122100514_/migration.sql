/*
  Warnings:

  - You are about to alter the column `startDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `speakerName` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventDetail` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `EventSchedule` ADD COLUMN `speakerDesc` VARCHAR(191) NULL,
    ADD COLUMN `speakerName` VARCHAR(255) NOT NULL;
