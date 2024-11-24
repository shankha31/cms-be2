/*
  Warnings:

  - You are about to alter the column `startDate` on the `eventdetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `eventdetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `eventdetail` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;
