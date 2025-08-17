/*
  Warnings:

  - You are about to drop the column `issuedById` on the `invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_issuedById_fkey`;

-- DropIndex
DROP INDEX `Invoice_issuedById_fkey` ON `invoice`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `issuedById`;
