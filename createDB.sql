-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.12-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para monitoreocultivos
CREATE DATABASE IF NOT EXISTS `monitoreocultivos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `monitoreocultivos`;

-- Volcando estructura para tabla monitoreocultivos.alerts
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(32) COLLATE utf8mb4_spanish_ci NOT NULL,
  `value` float NOT NULL,
  `reading` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reading_fk` (`reading`),
  CONSTRAINT `reading_fk` FOREIGN KEY (`reading`) REFERENCES `readings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla monitoreocultivos.readings
CREATE TABLE IF NOT EXISTS `readings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `temp` float NOT NULL,
  `ph` float unsigned NOT NULL,
  `co` float unsigned NOT NULL,
  `pa` float NOT NULL,
  `hum` float NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- La exportación de datos fue deseleccionada.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
