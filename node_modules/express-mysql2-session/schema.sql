CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` VARCHAR(128) NOT NULL,
  `expires` INT(11) UNSIGNED NOT NULL,
  `data` JSON,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB COLLATE='utf8_general_ci'