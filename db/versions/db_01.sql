-- CreateTable
CREATE TABLE `Movie` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `wikiUrl` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `imdbUrl` VARCHAR(191),

    UNIQUE INDEX `Movie.wikiUrl_unique`(`wikiUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `wikiUrl` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Person.wikiUrl_unique`(`wikiUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nomination` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `winner` BOOLEAN NOT NULL DEFAULT false,
    `personId` INT NOT NULL,
    `movieId` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AwardsBody` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AwardsCategory` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Award` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(191) NOT NULL,
    `awardsBodyId` INT NOT NULL,
    `awardsCategoryId` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Nomination` ADD FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nomination` ADD FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD FOREIGN KEY (`awardsBodyId`) REFERENCES `AwardsBody`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD FOREIGN KEY (`awardsCategoryId`) REFERENCES `AwardsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
