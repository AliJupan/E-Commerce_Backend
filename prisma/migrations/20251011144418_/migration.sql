-- AlterTable
ALTER TABLE `user` MODIFY `address` VARCHAR(50) NULL,
    MODIFY `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `city` VARCHAR(50) NULL,
    MODIFY `country` VARCHAR(50) NULL,
    MODIFY `postCode` VARCHAR(50) NULL;
