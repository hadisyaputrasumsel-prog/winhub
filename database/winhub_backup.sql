-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: winhub
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `biaya`
--

DROP TABLE IF EXISTS `biaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biaya` (
  `daya` int NOT NULL,
  `nidi` int NOT NULL DEFAULT '0',
  `slo` int NOT NULL DEFAULT '0',
  `area` int NOT NULL DEFAULT '0',
  `mitra` int NOT NULL DEFAULT '0',
  `langganan` int NOT NULL DEFAULT '0',
  `banyak_rutin` int NOT NULL DEFAULT '0',
  `pelanggan` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`daya`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biaya`
--

LOCK TABLES `biaya` WRITE;
/*!40000 ALTER TABLE `biaya` DISABLE KEYS */;
INSERT INTO `biaya` VALUES (450,45000,40000,23000,70000,85000,50000,135000),(900,90000,60000,39000,130000,150000,70000,200000),(1300,130000,120000,68000,165000,250000,130000,300000),(2200,220000,135000,91250,275000,355000,145000,405000),(3500,350000,122500,112875,400000,472500,132500,522500),(4400,440000,154000,141900,500000,594000,164000,644000),(5500,550000,192500,177375,600000,742500,202500,792500),(6600,660000,231000,212850,750000,891000,281000,991000),(7700,770000,269500,248325,800000,1039500,279500,1089500),(10600,1060000,318000,323300,1100000,1378000,368000,1478000),(11000,1100000,330000,335500,1200000,1430000,340000,1530000),(13200,1320000,264000,356400,1300000,1584000,314000,1684000),(16500,1650000,495000,503250,1800000,2145000,545000,2245000),(23000,1725000,690000,586500,2000000,2415000,740000,2515000),(33000,2475000,825000,783750,2800000,3300000,875000,3400000),(41500,3112500,1037500,985625,3500000,4150000,1087500,4250000),(53000,3975000,1325000,1258750,4500000,5300000,1375000,5400000),(66000,4950000,1650000,1567500,5600000,6600000,0,6800000),(82500,4950000,1650000,1567500,5600000,6600000,0,6800000),(105000,6300000,2100000,1995000,7000000,8400000,0,8600000),(131000,7860000,2620000,2489000,8900000,10480000,0,10680000),(147000,8820000,2940000,2793000,9800000,11760000,0,11960000),(164000,9840000,3280000,3116000,11000000,13120000,0,13320000),(197000,11820000,3940000,3743000,13000000,15760000,0,15960000);
/*!40000 ALTER TABLE `biaya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daya`
--

DROP TABLE IF EXISTS `daya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daya` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `daya` int NOT NULL,
  `golongan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daya`
--

LOCK TABLES `daya` WRITE;
/*!40000 ALTER TABLE `daya` DISABLE KEYS */;
INSERT INTO `daya` VALUES (1,450,'R-1/TR','Rumah Tangga Sangat Kecil / Subsidi'),(2,900,'R-1/TR','Rumah Tangga Kecil'),(3,1300,'R-1/TR','Rumah Tangga Sedang'),(4,2200,'R-1/TR','Rumah Tangga Menengah'),(5,3500,'R-2/TR','Rumah Tangga Besar'),(6,4400,'R-2/TR','Rumah Tangga Besar'),(7,5500,'R-3/TR','Rumah Tangga Mewah');
/*!40000 ALTER TABLE `daya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desa`
--

DROP TABLE IF EXISTS `desa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `desa` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kecamatanId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desa`
--

LOCK TABLES `desa` WRITE;
/*!40000 ALTER TABLE `desa` DISABLE KEYS */;
INSERT INTO `desa` VALUES ('desa-01','kec-01','Talang Kelapa'),('desa-02','kec-01','Kebun Bunga'),('desa-03','kec-02','Alang-Alang Lebar'),('desa-04','kec-03','Ario Kemuning'),('desa-05','kec-04','Sako Kenten'),('desa-06','kec-05','Kalidoni'),('desa-07','kec-05','Sei Selayur'),('desa-08','kec-06','Lorok Pakjo'),('desa-09','kec-06','Demang Lebar Daun'),('desa-10','kec-07','1 Ulu'),('desa-11','kec-07','2 Ulu'),('desa-12','kec-10','Kayu Agung Asli'),('desa-13','kec-10','Cinta Raja'),('desa-14','kec-11','Tugumulyo'),('desa-15','kec-12','Indralaya Indah'),('desa-16','kec-12','Timbangan'),('desa-17','kec-13','Tanjung Raja Barat'),('desa-18','kec-14','Sukajadi'),('desa-19','kec-15','Gelebak Dalam'),('desa-20','kec-16','Patih Galung'),('desa-21','kec-17','Gelumbang');
/*!40000 ALTER TABLE `desa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dusun`
--

DROP TABLE IF EXISTS `dusun`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dusun` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desaId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dusun`
--

LOCK TABLES `dusun` WRITE;
/*!40000 ALTER TABLE `dusun` DISABLE KEYS */;
INSERT INTO `dusun` VALUES ('dusun-01','desa-01','Dusun I'),('dusun-02','desa-01','RT 01'),('dusun-03','desa-01','RT 02'),('dusun-04','desa-08','RT 12'),('dusun-05','desa-08','RT 15'),('dusun-06','desa-16','Dusun III'),('dusun-07','desa-16','RT 05'),('dusun-08','desa-21','Dusun IV');
/*!40000 ALTER TABLE `dusun` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kecamatan`
--

DROP TABLE IF EXISTS `kecamatan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kecamatan` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kotaId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kecamatan`
--

LOCK TABLES `kecamatan` WRITE;
/*!40000 ALTER TABLE `kecamatan` DISABLE KEYS */;
INSERT INTO `kecamatan` VALUES ('kec-01','kota-01','Sukarami'),('kec-02','kota-01','Alang-Alang Lebar'),('kec-03','kota-01','Kemuning'),('kec-04','kota-01','Sako'),('kec-05','kota-01','Kalidoni'),('kec-06','kota-01','Ilir Barat I'),('kec-07','kota-01','Seberang Ulu I'),('kec-08','kota-02','Lubuklinggau Barat'),('kec-09','kota-02','Lubuklinggau Timur'),('kec-10','kota-03','Kayu Agung'),('kec-11','kota-03','Lempuing'),('kec-12','kota-04','Indralaya'),('kec-13','kota-04','Tanjung Raja'),('kec-14','kota-05','Talang Kelapa'),('kec-15','kota-05','Rambutan'),('kec-16','kota-06','Prabumulih Barat'),('kec-17','kota-07','Gelumbang');
/*!40000 ALTER TABLE `kecamatan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kota`
--

DROP TABLE IF EXISTS `kota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kota` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinsiId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kota`
--

LOCK TABLES `kota` WRITE;
/*!40000 ALTER TABLE `kota` DISABLE KEYS */;
INSERT INTO `kota` VALUES ('kota-01','prov-01','Palembang'),('kota-02','prov-01','Lubuklinggau'),('kota-03','prov-01','Ogan Komering Ilir (OKI)'),('kota-04','prov-01','Ogan Ilir (OI)'),('kota-05','prov-01','Banyuasin'),('kota-06','prov-01','Prabumulih'),('kota-07','prov-01','Muara Enim'),('kota-08','prov-01','Pagar Alam'),('kota-09','prov-01','Lahat'),('kota-10','prov-01','Musi Banyuasin (Muba)'),('kota-11','prov-01','Musi Rawas (Mura)'),('kota-12','prov-01','Musi Rawas Utara (Muratara)'),('kota-13','prov-01','Ogan Komering Ulu (OKU)'),('kota-14','prov-01','OKU Selatan'),('kota-15','prov-01','OKU Timur'),('kota-16','prov-01','Penukal Abab Lematang Ilir (PALI)'),('kota-17','prov-01','Empat Lawang'),('kota-18','prov-02','Pangkal Pinang'),('kota-19','prov-02','Bangka'),('kota-20','prov-02','Bangka Barat'),('kota-21','prov-02','Bangka Selatan'),('kota-22','prov-02','Bangka Tengah'),('kota-23','prov-02','Belitung'),('kota-24','prov-02','Belitung Timur'),('kota-25','prov-03','Jambi'),('kota-26','prov-03','Sungai Penuh'),('kota-27','prov-03','Batanghari'),('kota-28','prov-03','Bungo'),('kota-29','prov-03','Kerinci'),('kota-30','prov-03','Merangin'),('kota-31','prov-03','Muaro Jambi'),('kota-32','prov-03','Sarolangun'),('kota-33','prov-03','Tanjung Jabung Barat'),('kota-34','prov-03','Tanjung Jabung Timur'),('kota-35','prov-03','Tebo'),('kota-36','prov-04','Bengkulu'),('kota-37','prov-04','Bengkulu Selatan'),('kota-38','prov-04','Bengkulu Tengah'),('kota-39','prov-04','Bengkulu Utara'),('kota-40','prov-04','Kaur'),('kota-41','prov-04','Kepahiang'),('kota-42','prov-04','Lebong'),('kota-43','prov-04','Mukomuko'),('kota-44','prov-04','Rejang Lebong'),('kota-45','prov-04','Seluma');
/*!40000 ALTER TABLE `kota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,'Winata','Menghapus akun user: tes','2026-05-25 15:38:33'),(2,'Winata','Me-reset kata sandi untuk akun: tes','2026-05-25 12:27:19'),(3,'Winata','Meregistrasikan user baru tes dengan role Admin Pelayanan','2026-05-25 12:18:51'),(4,'Winata','Memperbarui profil user: Winata','2026-05-25 12:18:02'),(5,'Bapak Winata','Memperbarui profil user: Winata','2026-05-25 12:12:36'),(6,'Bapak Winata','Menghapus akun user: tes','2026-05-25 12:08:09'),(7,'Bapak Winata','Meregistrasikan user baru tes dengan role Admin Pelayanan','2026-05-25 12:01:19');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_05_19_000000_create_winhub_tables',1),(5,'2026_05_26_000000_add_hp_and_status_to_permohonan_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permohonan`
--

DROP TABLE IF EXISTS `permohonan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permohonan` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusMember` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `namaPemohon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaPelanggan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `daya` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `kecamatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biaya` int NOT NULL,
  `metodePembayaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenisPermohonan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ttNidi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ttSlo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatanNidi` text COLLATE utf8mb4_unicode_ci,
  `catatanSlo` text COLLATE utf8mb4_unicode_ci,
  `pembayaranStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shared` tinyint(1) NOT NULL DEFAULT '0',
  `tanggalInput` datetime NOT NULL,
  `nidiFile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sloFile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buktiBayar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permohonan`
--

LOCK TABLES `permohonan` WRITE;
/*!40000 ALTER TABLE `permohonan` DISABLE KEYS */;
/*!40000 ALTER TABLE `permohonan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinsi`
--

DROP TABLE IF EXISTS `provinsi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinsi` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinsi`
--

LOCK TABLES `provinsi` WRITE;
/*!40000 ALTER TABLE `provinsi` DISABLE KEYS */;
INSERT INTO `provinsi` VALUES ('prov-01','Sumatera Selatan'),('prov-02','Bangka Belitung'),('prov-03','Jambi'),('prov-04','Bengkulu');
/*!40000 ALTER TABLE `provinsi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('usr-00','Super Admin','superadmin@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','Super Admin','SA','6281234567890'),('usr-01','Ilsa Pelayanan','pelayanan@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','Admin Pelayanan','IP','6281234567891'),('usr-02','Rian Proses','proses@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','Admin Proses','RP','6281234567892'),('usr-03','Tono NIDI','nidi@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','TT NIDI','TN','6281234567893'),('usr-04','Slamet SLO','slo@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','TT SLO','SS','6281234567894'),('usr-05','Kiki Keuangan','keuangan@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','Admin Keuangan','KK','6281234567895'),('usr-06','Winata','manager@winhub.com','$2y$12$I.dwuTL.8wlgVZHqUAQYDugK7KQEaP3deDYMtRmNnVaKHm.IToibu','Manager','WI','6281234567896');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30 11:08:05
