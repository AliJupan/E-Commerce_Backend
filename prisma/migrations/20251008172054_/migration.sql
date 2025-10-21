/*
  Warnings:

  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `birthday`,
    MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';
