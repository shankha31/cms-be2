/*
  Warnings:

  - You are about to alter the column `startDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `EventDetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `EventDetail` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `UserProfile` ADD COLUMN `description` TEXT NULL;

-- CreateTable
CREATE TABLE `Expertise` (
    `expertiseId` INTEGER NOT NULL AUTO_INCREMENT,
    `expertiseName` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Expertise_expertiseName_key`(`expertiseName`),
    PRIMARY KEY (`expertiseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserExpertise` (
    `userExpertiseId` INTEGER NOT NULL AUTO_INCREMENT,
    `userProfileId` INTEGER NOT NULL,
    `expertiseId` INTEGER NOT NULL,

    UNIQUE INDEX `UserExpertise_userProfileId_expertiseId_key`(`userProfileId`, `expertiseId`),
    PRIMARY KEY (`userExpertiseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubmissionExpertise` (
    `submissionExpertiseId` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionRecordId` INTEGER NOT NULL,
    `expertiseId` INTEGER NOT NULL,

    UNIQUE INDEX `SubmissionExpertise_submissionRecordId_expertiseId_key`(`submissionRecordId`, `expertiseId`),
    PRIMARY KEY (`submissionExpertiseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserExpertise` ADD CONSTRAINT `UserExpertise_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfile`(`userProfileId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExpertise` ADD CONSTRAINT `UserExpertise_expertiseId_fkey` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`expertiseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionExpertise` ADD CONSTRAINT `SubmissionExpertise_submissionRecordId_fkey` FOREIGN KEY (`submissionRecordId`) REFERENCES `SubmissionRecord`(`submissionRecordId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionExpertise` ADD CONSTRAINT `SubmissionExpertise_expertiseId_fkey` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`expertiseId`) ON DELETE RESTRICT ON UPDATE CASCADE;
