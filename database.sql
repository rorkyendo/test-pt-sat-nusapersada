-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.32 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table test_pt_sat_nusapersada.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `CUSTOMER_ID` int NOT NULL AUTO_INCREMENT,
  `CUSTOMER_NAME` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`CUSTOMER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table test_pt_sat_nusapersada.customers: ~6 rows (approximately)
INSERT INTO `customers` (`CUSTOMER_ID`, `CUSTOMER_NAME`) VALUES
	(1, 'CUSTOMER A'),
	(2, 'CUSTOMER B'),
	(3, 'CUSTOMER C'),
	(4, 'CUSTOMER D'),
	(5, 'CUSTOMER E'),
	(6, 'CUSTOMER F');

-- Dumping structure for table test_pt_sat_nusapersada.products
CREATE TABLE IF NOT EXISTS `products` (
  `PRODUCT_ID` int NOT NULL AUTO_INCREMENT,
  `PRODUCT_CODE` varchar(15) DEFAULT NULL,
  `PRODUCT_NAME` varchar(250) DEFAULT NULL,
  `PRODUCT_PRICE` float DEFAULT NULL,
  `PRODUCT_STATUS` varchar(11) DEFAULT '0',
  `PRODUCT_STOCK` int DEFAULT '0',
  PRIMARY KEY (`PRODUCT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

-- Dumping data for table test_pt_sat_nusapersada.products: ~15 rows (approximately)
INSERT INTO `products` (`PRODUCT_ID`, `PRODUCT_CODE`, `PRODUCT_NAME`, `PRODUCT_PRICE`, `PRODUCT_STATUS`, `PRODUCT_STOCK`) VALUES
	(1, 'PRD0000000001', 'NASI GORENG', 13000, 'Active', 55),
	(2, 'PRD0000000002', 'BAKMI AYAM', 12000, 'Active', 187),
	(3, 'PRD0000000003', 'NASI PADANG', 17000, 'Active', 300),
	(4, 'PRD0000000004', 'AYAM PENYET', 18000, 'Active', 400),
	(5, 'PRD0000000005', 'PECEL AYAM', 22000, 'Active', 120),
	(6, 'PRD0000000006', 'PECEL BEBEK', 30000, 'Active', 130),
	(7, 'PRD0000000007', 'PECEL LELE', 18000, 'Active', 140),
	(8, 'PRD0000000008', 'JAGUNG BAKAR', 7000, 'Active', 148),
	(9, 'PRD0000000009', 'TEH HANGAT', 5000, 'Active', 160),
	(10, 'PRD0000000010', 'JAHE HANGAT', 8000, 'Active', 170),
	(11, 'PRD0000000011', 'AIR MINERAL MERK A', 4000, 'Active', 179),
	(12, 'PRD0000000012', 'KOPI HITAM', 3000, 'Active', 189),
	(13, 'PRD0000000013', 'TEH HUJAU', 9000, 'hold', 220),
	(14, 'PRD0000000014', 'TELUR REBUS', 4000, 'hold', 10),
	(15, 'PRD0000000015', 'KAMBING GULING', 120000, 'hold', 3),
	(17, 'PRD0000000016', 'Test', 10000, 'Active', 0);

-- Dumping structure for table test_pt_sat_nusapersada.sales
CREATE TABLE IF NOT EXISTS `sales` (
  `SALE_ID` int NOT NULL AUTO_INCREMENT,
  `SALE_DATE` datetime DEFAULT NULL,
  `CUSTOMER_ID` int DEFAULT NULL,
  `SALE_ITEMS_TOTAL` int DEFAULT '0',
  PRIMARY KEY (`SALE_ID`),
  KEY `CUSTOMER_ID_IDX` (`CUSTOMER_ID`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`CUSTOMER_ID`) REFERENCES `customers` (`CUSTOMER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table test_pt_sat_nusapersada.sales: ~3 rows (approximately)
INSERT INTO `sales` (`SALE_ID`, `SALE_DATE`, `CUSTOMER_ID`, `SALE_ITEMS_TOTAL`) VALUES
	(1, '2024-09-05 00:00:00', 5, 2),
	(2, '2024-09-06 00:00:00', 2, 2),
	(3, '2024-09-07 00:00:00', 1, 1);

-- Dumping structure for table test_pt_sat_nusapersada.sale_items
CREATE TABLE IF NOT EXISTS `sale_items` (
  `ITEM_ID` int NOT NULL AUTO_INCREMENT,
  `SALE_ID` int DEFAULT NULL,
  `PRODUCT_ID` int DEFAULT NULL,
  `PRODUCT_PRICE` float DEFAULT NULL,
  `ITEM_QTY` int DEFAULT '0',
  `IS_VERIFY` int DEFAULT '0',
  PRIMARY KEY (`ITEM_ID`),
  KEY `SALE_ID_IDX` (`SALE_ID`),
  KEY `PRODUCT_ID_IDX` (`PRODUCT_ID`),
  CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`SALE_ID`) REFERENCES `sales` (`SALE_ID`),
  CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `products` (`PRODUCT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table test_pt_sat_nusapersada.sale_items: ~5 rows (approximately)
INSERT INTO `sale_items` (`ITEM_ID`, `SALE_ID`, `PRODUCT_ID`, `PRODUCT_PRICE`, `ITEM_QTY`, `IS_VERIFY`) VALUES
	(1, 1, 11, 4000, 1, 0),
	(2, 1, 12, 3000, 1, 0),
	(3, 2, 2, 12000, 3, 0),
	(4, 2, 8, 7000, 2, 0),
	(5, 3, 2, 12000, 10, 0);

-- Dumping structure for view test_pt_sat_nusapersada.v_sales
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_sales` (
	`SALE_ID` INT(10) NOT NULL,
	`SALE_DATE` DATETIME NULL,
	`CUSTOMER_ID` INT(10) NULL,
	`SALE_ITEMS_TOTAL` INT(10) NULL,
	`CUSTOMER_NAME` VARCHAR(200) NULL COLLATE 'latin1_swedish_ci',
	`TOTAL_PRICE` DOUBLE NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view test_pt_sat_nusapersada.v_sales
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_sales`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_sales` AS select `s`.`SALE_ID` AS `SALE_ID`,`s`.`SALE_DATE` AS `SALE_DATE`,`s`.`CUSTOMER_ID` AS `CUSTOMER_ID`,`s`.`SALE_ITEMS_TOTAL` AS `SALE_ITEMS_TOTAL`,`c`.`CUSTOMER_NAME` AS `CUSTOMER_NAME`,coalesce(sum((`si`.`PRODUCT_PRICE` * `si`.`ITEM_QTY`)),0) AS `TOTAL_PRICE` from ((`sales` `s` left join `customers` `c` on((`s`.`CUSTOMER_ID` = `c`.`CUSTOMER_ID`))) left join `sale_items` `si` on((`s`.`SALE_ID` = `si`.`SALE_ID`))) group by `s`.`SALE_ID`,`s`.`SALE_DATE`,`s`.`CUSTOMER_ID`,`s`.`SALE_ITEMS_TOTAL`,`c`.`CUSTOMER_NAME`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
