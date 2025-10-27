-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: siscorp
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `entradasestoque`
--

DROP TABLE IF EXISTS `entradasestoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entradasestoque` (
  `idEntrada` int NOT NULL AUTO_INCREMENT,
  `quantidade` int NOT NULL,
  `dataEntrada` date NOT NULL,
  `preco` float NOT NULL,
  `idIngrediente` int NOT NULL,
  PRIMARY KEY (`idEntrada`,`idIngrediente`),
  KEY `fk_entradas_ingredientes1_idx` (`idIngrediente`),
  CONSTRAINT `fk_entradas_ingredientes1` FOREIGN KEY (`idIngrediente`) REFERENCES `ingredientes` (`idingrediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entradasestoque`
--

LOCK TABLES `entradasestoque` WRITE;
/*!40000 ALTER TABLE `entradasestoque` DISABLE KEYS */;
INSERT INTO `entradasestoque` VALUES (1,50,'2025-08-09',1.99,1);
/*!40000 ALTER TABLE `entradasestoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcoes`
--

DROP TABLE IF EXISTS `funcoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcoes` (
  `idFuncao` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) NOT NULL,
  PRIMARY KEY (`idFuncao`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcoes`
--

LOCK TABLES `funcoes` WRITE;
/*!40000 ALTER TABLE `funcoes` DISABLE KEYS */;
INSERT INTO `funcoes` VALUES (5,'Gerente',''),(6,'Donos',''),(7,'Cozinha','');
/*!40000 ALTER TABLE `funcoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `idingrediente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `medida` char(1) NOT NULL,
  `estoqueAtual` int NOT NULL,
  `estoqueMin` int NOT NULL,
  `precoUni` float NOT NULL,
  PRIMARY KEY (`idingrediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
INSERT INTO `ingredientes` VALUES (1,'hamburguer','K',50,30,1.99);
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_auditoria`
--

DROP TABLE IF EXISTS `log_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_auditoria` (
  `idLog` int NOT NULL AUTO_INCREMENT,
  `tabela` varchar(64) NOT NULL,
  `operacao` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `registroId` int DEFAULT NULL,
  `valoresAntigos` text,
  `valoresNovos` text,
  `usuarioSistema` varchar(100) DEFAULT NULL,
  `dataOperacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idLog`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_auditoria`
--

LOCK TABLES `log_auditoria` WRITE;
/*!40000 ALTER TABLE `log_auditoria` DISABLE KEYS */;
INSERT INTO `log_auditoria` VALUES (1,'usuarios','INSERT',11,NULL,'nome=Ana, login=Ana, idFuncoes=5','root@localhost','2025-09-26 23:57:20'),(2,'vendas','DELETE',2,'idProduto=2, idUsuario=6, valorTotal=1.99, quantidade=1',NULL,'root@localhost','2025-10-27 00:30:00'),(3,'produtos','DELETE',2,'nome=X-Salada, categoria=Lanche, preco=1,99',NULL,'root@localhost','2025-10-27 00:30:02'),(4,'produtos','INSERT',3,NULL,'nome=Smash Bacon, categoria=Lanche, preco=29.90','root@localhost','2025-10-27 00:32:25'),(5,'produtos','INSERT',4,NULL,'nome=X-Salada, categoria=Lanche, preco=25.90','root@localhost','2025-10-27 00:32:25'),(6,'produtos','INSERT',5,NULL,'nome=X-Tudo, categoria=Lanche, preco=32.90','root@localhost','2025-10-27 00:32:25'),(7,'produtos','INSERT',6,NULL,'nome=Batata Frita, categoria=Acompanhamento, preco=12.00','root@localhost','2025-10-27 00:32:25'),(8,'produtos','INSERT',7,NULL,'nome=Coca-Cola 350ml, categoria=Bebida, preco=6.00','root@localhost','2025-10-27 00:32:25'),(9,'produtos','INSERT',8,NULL,'nome=Suco Natural 500ml, categoria=Bebida, preco=8.00','root@localhost','2025-10-27 00:32:25'),(10,'produtos','INSERT',9,NULL,'nome=Onion Rings, categoria=Acompanhamento, preco=14.00','root@localhost','2025-10-27 00:32:25'),(11,'produtos','INSERT',10,NULL,'nome=Cheeseburger, categoria=Lanche, preco=27.00','root@localhost','2025-10-27 00:32:25'),(12,'produtos','INSERT',11,NULL,'nome=Água Mineral, categoria=Bebida, preco=4.00','root@localhost','2025-10-27 00:32:25'),(13,'vendas','INSERT',3,NULL,'idProduto=1, idUsuario=5, valorTotal=29.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(14,'vendas','INSERT',4,NULL,'idProduto=1, idUsuario=5, valorTotal=59.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(15,'vendas','INSERT',5,NULL,'idProduto=1, idUsuario=6, valorTotal=89.7, quantidade=3','root@localhost','2025-10-27 00:32:25'),(16,'vendas','INSERT',6,NULL,'idProduto=1, idUsuario=7, valorTotal=29.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(17,'vendas','INSERT',7,NULL,'idProduto=1, idUsuario=6, valorTotal=59.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(18,'vendas','INSERT',8,NULL,'idProduto=1, idUsuario=6, valorTotal=89.7, quantidade=3','root@localhost','2025-10-27 00:32:25'),(19,'vendas','INSERT',9,NULL,'idProduto=1, idUsuario=9, valorTotal=29.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(20,'vendas','INSERT',10,NULL,'idProduto=1, idUsuario=5, valorTotal=59.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(21,'vendas','INSERT',11,NULL,'idProduto=1, idUsuario=10, valorTotal=29.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(22,'vendas','INSERT',12,NULL,'idProduto=1, idUsuario=11, valorTotal=59.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(23,'vendas','INSERT',13,NULL,'idProduto=2, idUsuario=5, valorTotal=25.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(24,'vendas','INSERT',14,NULL,'idProduto=2, idUsuario=5, valorTotal=51.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(25,'vendas','INSERT',15,NULL,'idProduto=2, idUsuario=6, valorTotal=77.7, quantidade=3','root@localhost','2025-10-27 00:32:25'),(26,'vendas','INSERT',16,NULL,'idProduto=2, idUsuario=9, valorTotal=25.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(27,'vendas','INSERT',17,NULL,'idProduto=2, idUsuario=11, valorTotal=25.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(28,'vendas','INSERT',18,NULL,'idProduto=3, idUsuario=10, valorTotal=32.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(29,'vendas','INSERT',19,NULL,'idProduto=3, idUsuario=10, valorTotal=65.8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(30,'vendas','INSERT',20,NULL,'idProduto=3, idUsuario=9, valorTotal=32.9, quantidade=1','root@localhost','2025-10-27 00:32:25'),(31,'vendas','INSERT',21,NULL,'idProduto=3, idUsuario=5, valorTotal=98.7, quantidade=3','root@localhost','2025-10-27 00:32:25'),(32,'vendas','INSERT',22,NULL,'idProduto=4, idUsuario=5, valorTotal=12, quantidade=1','root@localhost','2025-10-27 00:32:25'),(33,'vendas','INSERT',23,NULL,'idProduto=4, idUsuario=5, valorTotal=24, quantidade=2','root@localhost','2025-10-27 00:32:25'),(34,'vendas','INSERT',24,NULL,'idProduto=4, idUsuario=6, valorTotal=36, quantidade=3','root@localhost','2025-10-27 00:32:25'),(35,'vendas','INSERT',25,NULL,'idProduto=4, idUsuario=9, valorTotal=24, quantidade=2','root@localhost','2025-10-27 00:32:25'),(36,'vendas','INSERT',26,NULL,'idProduto=4, idUsuario=10, valorTotal=12, quantidade=1','root@localhost','2025-10-27 00:32:25'),(37,'vendas','INSERT',27,NULL,'idProduto=5, idUsuario=5, valorTotal=12, quantidade=2','root@localhost','2025-10-27 00:32:25'),(38,'vendas','INSERT',28,NULL,'idProduto=5, idUsuario=6, valorTotal=6, quantidade=1','root@localhost','2025-10-27 00:32:25'),(39,'vendas','INSERT',29,NULL,'idProduto=5, idUsuario=7, valorTotal=12, quantidade=2','root@localhost','2025-10-27 00:32:25'),(40,'vendas','INSERT',30,NULL,'idProduto=5, idUsuario=9, valorTotal=18, quantidade=3','root@localhost','2025-10-27 00:32:25'),(41,'vendas','INSERT',31,NULL,'idProduto=5, idUsuario=10, valorTotal=24, quantidade=4','root@localhost','2025-10-27 00:32:25'),(42,'vendas','INSERT',32,NULL,'idProduto=6, idUsuario=5, valorTotal=8, quantidade=1','root@localhost','2025-10-27 00:32:25'),(43,'vendas','INSERT',33,NULL,'idProduto=6, idUsuario=5, valorTotal=16, quantidade=2','root@localhost','2025-10-27 00:32:25'),(44,'vendas','INSERT',34,NULL,'idProduto=6, idUsuario=9, valorTotal=8, quantidade=1','root@localhost','2025-10-27 00:32:25'),(45,'vendas','INSERT',35,NULL,'idProduto=6, idUsuario=11, valorTotal=24, quantidade=3','root@localhost','2025-10-27 00:32:25'),(46,'vendas','INSERT',36,NULL,'idProduto=7, idUsuario=9, valorTotal=14, quantidade=1','root@localhost','2025-10-27 00:32:25'),(47,'vendas','INSERT',37,NULL,'idProduto=7, idUsuario=10, valorTotal=28, quantidade=2','root@localhost','2025-10-27 00:32:25'),(48,'vendas','INSERT',38,NULL,'idProduto=7, idUsuario=11, valorTotal=14, quantidade=1','root@localhost','2025-10-27 00:32:25'),(49,'vendas','INSERT',39,NULL,'idProduto=8, idUsuario=5, valorTotal=27, quantidade=1','root@localhost','2025-10-27 00:32:25'),(50,'vendas','INSERT',40,NULL,'idProduto=8, idUsuario=6, valorTotal=54, quantidade=2','root@localhost','2025-10-27 00:32:25'),(51,'vendas','INSERT',41,NULL,'idProduto=8, idUsuario=7, valorTotal=27, quantidade=1','root@localhost','2025-10-27 00:32:25'),(52,'vendas','INSERT',42,NULL,'idProduto=9, idUsuario=10, valorTotal=4, quantidade=1','root@localhost','2025-10-27 00:32:25'),(53,'vendas','INSERT',43,NULL,'idProduto=9, idUsuario=10, valorTotal=8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(54,'vendas','INSERT',44,NULL,'idProduto=9, idUsuario=9, valorTotal=12, quantidade=3','root@localhost','2025-10-27 00:32:25'),(55,'vendas','INSERT',45,NULL,'idProduto=9, idUsuario=6, valorTotal=8, quantidade=2','root@localhost','2025-10-27 00:32:25'),(56,'vendas','INSERT',46,NULL,'idProduto=9, idUsuario=5, valorTotal=4, quantidade=1','root@localhost','2025-10-27 00:32:25');
/*!40000 ALTER TABLE `log_auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lote`
--

DROP TABLE IF EXISTS `lote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lote` (
  `idLote` int NOT NULL AUTO_INCREMENT,
  `idProduto` int NOT NULL,
  `codigo` int NOT NULL,
  `quantidade` int NOT NULL,
  `dataValidade` date NOT NULL,
  `dataFabricacao` date NOT NULL,
  PRIMARY KEY (`idLote`),
  KEY `fk_lote_produto_idx` (`idProduto`),
  CONSTRAINT `fk_lote_produto` FOREIGN KEY (`idProduto`) REFERENCES `produtos` (`idProduto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lote`
--

LOCK TABLES `lote` WRITE;
/*!40000 ALTER TABLE `lote` DISABLE KEYS */;
/*!40000 ALTER TABLE `lote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `idProduto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `categoria` varchar(45) NOT NULL,
  `preco` varchar(45) NOT NULL,
  PRIMARY KEY (`idProduto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Smash Bacon','Lanche','29,90'),(3,'Smash Bacon','Lanche','29.90'),(4,'X-Salada','Lanche','25.90'),(5,'X-Tudo','Lanche','32.90'),(6,'Batata Frita','Acompanhamento','12.00'),(7,'Coca-Cola 350ml','Bebida','6.00'),(8,'Suco Natural 500ml','Bebida','8.00'),(9,'Onion Rings','Acompanhamento','14.00'),(10,'Cheeseburger','Lanche','27.00'),(11,'Água Mineral','Bebida','4.00');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `qtdvenda`
--

DROP TABLE IF EXISTS `qtdvenda`;
/*!50001 DROP VIEW IF EXISTS `qtdvenda`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `qtdvenda` AS SELECT 
 1 AS `Produto`,
 1 AS `TotalVendida`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `receitas`
--

DROP TABLE IF EXISTS `receitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receitas` (
  `idReceita` int NOT NULL AUTO_INCREMENT,
  `dProduto` int NOT NULL,
  `idIngrediente` int NOT NULL,
  `quantidade` int NOT NULL,
  `essencial` tinyint NOT NULL,
  PRIMARY KEY (`idReceita`,`dProduto`,`idIngrediente`),
  KEY `fk_produtos_has_ingredientes_ingredientes1_idx` (`idIngrediente`),
  KEY `fk_produtos_has_ingredientes_produtos_idx` (`dProduto`),
  CONSTRAINT `fk_produtos_has_ingredientes_ingredientes1` FOREIGN KEY (`idIngrediente`) REFERENCES `ingredientes` (`idingrediente`),
  CONSTRAINT `fk_produtos_has_ingredientes_produtos` FOREIGN KEY (`dProduto`) REFERENCES `produtos` (`idProduto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receitas`
--

LOCK TABLES `receitas` WRITE;
/*!40000 ALTER TABLE `receitas` DISABLE KEYS */;
INSERT INTO `receitas` VALUES (1,1,1,1,1);
/*!40000 ALTER TABLE `receitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `receitas de produtos`
--

DROP TABLE IF EXISTS `receitas de produtos`;
/*!50001 DROP VIEW IF EXISTS `receitas de produtos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `receitas de produtos` AS SELECT 
 1 AS `idReceita`,
 1 AS `dProduto`,
 1 AS `idIngrediente`,
 1 AS `quantidade`,
 1 AS `essencial`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `login` varchar(45) NOT NULL,
  `senha` varchar(45) NOT NULL,
  `idFuncoes` int NOT NULL,
  PRIMARY KEY (`idUsuario`,`idFuncoes`),
  KEY `fk_usuarios_funcoes1_idx` (`idFuncoes`),
  CONSTRAINT `fk_usuarios_funcoes1` FOREIGN KEY (`idFuncoes`) REFERENCES `funcoes` (`idFuncao`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (5,'Pedro de Freitas da Silva','Pedro','1234',5),(6,'João Toledo','joao','1234',5),(9,'Gaby','Gaby','1234',6),(10,'Yasmin','Yasmin','1234',7),(11,'Ana','Ana','1234',5);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `idvenda` int NOT NULL AUTO_INCREMENT,
  `idProduto` int NOT NULL,
  `idUsuario` int NOT NULL,
  `dataVenda` date NOT NULL,
  `valorTotal` float NOT NULL,
  `quantidade` varchar(45) NOT NULL,
  PRIMARY KEY (`idvenda`),
  KEY `fk_vendas_produtos1_idx` (`idProduto`),
  KEY `fk_vendas_usuarios1_idx` (`idUsuario`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
INSERT INTO `vendas` VALUES (1,1,5,'2025-08-09',29.9,'1'),(3,1,5,'2025-10-01',29.9,'1'),(4,1,5,'2025-10-02',59.8,'2'),(5,1,6,'2025-10-03',89.7,'3'),(6,1,7,'2025-10-04',29.9,'1'),(7,1,6,'2025-10-05',59.8,'2'),(8,1,6,'2025-10-08',89.7,'3'),(9,1,9,'2025-10-10',29.9,'1'),(10,1,5,'2025-10-12',59.8,'2'),(11,1,10,'2025-10-15',29.9,'1'),(12,1,11,'2025-10-18',59.8,'2'),(13,2,5,'2025-10-01',25.9,'1'),(14,2,5,'2025-10-05',51.8,'2'),(15,2,6,'2025-10-08',77.7,'3'),(16,2,9,'2025-10-12',25.9,'1'),(17,2,11,'2025-10-18',25.9,'1'),(18,3,10,'2025-10-03',32.9,'1'),(19,3,10,'2025-10-06',65.8,'2'),(20,3,9,'2025-10-10',32.9,'1'),(21,3,5,'2025-10-20',98.7,'3'),(22,4,5,'2025-10-01',12,'1'),(23,4,5,'2025-10-03',24,'2'),(24,4,6,'2025-10-07',36,'3'),(25,4,9,'2025-10-10',24,'2'),(26,4,10,'2025-10-18',12,'1'),(27,5,5,'2025-10-01',12,'2'),(28,5,6,'2025-10-04',6,'1'),(29,5,7,'2025-10-07',12,'2'),(30,5,9,'2025-10-10',18,'3'),(31,5,10,'2025-10-12',24,'4'),(32,6,5,'2025-10-02',8,'1'),(33,6,5,'2025-10-05',16,'2'),(34,6,9,'2025-10-08',8,'1'),(35,6,11,'2025-10-10',24,'3'),(36,7,9,'2025-10-03',14,'1'),(37,7,10,'2025-10-07',28,'2'),(38,7,11,'2025-10-15',14,'1'),(39,8,5,'2025-10-03',27,'1'),(40,8,6,'2025-10-08',54,'2'),(41,8,7,'2025-10-12',27,'1'),(42,9,10,'2025-10-01',4,'1'),(43,9,10,'2025-10-05',8,'2'),(44,9,9,'2025-10-07',12,'3'),(45,9,6,'2025-10-10',8,'2'),(46,9,5,'2025-10-15',4,'1');
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `qtdvenda`
--

/*!50001 DROP VIEW IF EXISTS `qtdvenda`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `qtdvenda` AS select `p`.`nome` AS `Produto`,sum(cast(`v`.`quantidade` as unsigned)) AS `TotalVendida` from (`vendas` `v` join `produtos` `p` on((`v`.`idProduto` = `p`.`idProduto`))) group by `p`.`nome` order by `TotalVendida` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `receitas de produtos`
--

/*!50001 DROP VIEW IF EXISTS `receitas de produtos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `receitas de produtos` AS select `receitas`.`idReceita` AS `idReceita`,`receitas`.`dProduto` AS `dProduto`,`receitas`.`idIngrediente` AS `idIngrediente`,`receitas`.`quantidade` AS `quantidade`,`receitas`.`essencial` AS `essencial` from `receitas` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 21:40:11
