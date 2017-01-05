<?php

/**
 * product short summary.
 *
 * product description.
 *CREATE TABLE `rg`.`product` (
`id` INT NOT NULL AUTO_INCREMENT,
`internalId` VARCHAR(45) NULL,
`idcategory` VARCHAR(45) NULL,
`title` VARCHAR(45) NULL,
`description` VARCHAR(75) NULL,
`price` VARCHAR(45) NULL,
`special` TINYINT(1) NULL,
PRIMARY KEY (`id`));

 * @version 1.0
 * @author eduardo.azuaga
 */
class product
{
    public $id;
    public $internalId;
    public $idcategory;
    public $title;
    public $description;
    public $price;
    public $special;
    public $img;
    
}
