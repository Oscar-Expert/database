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
    `awardId` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Award` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `awardsBody` ENUM(
        'AMPAS', 
        'GG', 
        'BAFTA', 
        'CC', 
        'PGA', 
        'DGA', 
        'SAG'
    ) NOT NULL,
    `awardsCategory` ENUM(
        'PICTURE',
        'DIRECTOR',
        'ACTOR',
        'ACTRESS',
        'SUPPORTING_ACTOR',
        'SUPPORTING_ACTRESS',
        'SOUND',
        'SOUND_MIXING',
        'SOUND_EDITING'
    ) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT UC_Award UNIQUE (year, awardsBody, awardsCategory)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Nomination` ADD FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nomination` ADD FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nomination` ADD FOREIGN KEY (`awardId`) REFERENCES `Award`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
