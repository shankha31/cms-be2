/*
  Warnings:

  - You are about to alter the column `startDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `EventDetail` ADD COLUMN `image` TEXT NULL,
    MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `SubmissionRecord` MODIFY `submissionAbstract` TEXT NULL;