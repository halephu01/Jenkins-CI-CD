-- V1__init.sql
CREATE TABLE `t_inventory` (
                            `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
                            `sku_code` VARCHAR(255),
                            `quantity` INT(11),
                            PRIMARY KEY (`id`)
);

