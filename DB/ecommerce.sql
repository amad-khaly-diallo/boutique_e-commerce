-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 03 déc. 2025 à 12:51
-- Version du serveur : 8.0.44-0ubuntu0.24.04.1
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecommerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `Address`
--

CREATE TABLE `Address` (
  `address_id` int NOT NULL,
  `user_id` int NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `societe` varchar(150) DEFAULT NULL,
  `adresse` text NOT NULL,
  `apt` varchar(150) DEFAULT NULL,
  `ville` varchar(150) DEFAULT NULL,
  `codePostal` varchar(20) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `parDefaut` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Cart`
--

CREATE TABLE `Cart` (
  `cart_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Cart`
--

INSERT INTO `Cart` (`cart_id`, `user_id`, `created_at`) VALUES
(1, 1, '2025-11-19 10:07:12'),
(2, 2, '2025-11-19 10:07:12'),
(3, 8, '2025-12-03 12:42:49');

-- --------------------------------------------------------

--
-- Structure de la table `Cart_item`
--

CREATE TABLE `Cart_item` (
  `cart_item_id` int NOT NULL,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Cart_item`
--

INSERT INTO `Cart_item` (`cart_item_id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 12, 1),
(2, 1, 13, 1),
(3, 2, 3, 1),
(4, 3, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

CREATE TABLE `favorites` (
  `favorite_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`favorite_id`, `user_id`, `product_id`, `created_at`) VALUES
(1, NULL, 1, '2025-12-02 08:44:21'),
(2, NULL, 2, '2025-12-02 08:44:21'),
(3, NULL, 3, '2025-12-02 08:44:21'),
(4, NULL, 5, '2025-12-02 08:44:21'),
(5, NULL, 8, '2025-12-02 08:44:21'),
(6, 1, 3, '2025-12-02 08:55:52'),
(7, 1, 5, '2025-12-02 08:55:52'),
(8, 1, 8, '2025-12-02 08:55:52'),
(9, 8, 8, '2025-12-03 12:42:27');

-- --------------------------------------------------------

--
-- Structure de la table `Order`
--

CREATE TABLE `Order` (
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `address` text,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Order`
--

INSERT INTO `Order` (`order_id`, `user_id`, `address`, `total_amount`, `status`, `created_at`) VALUES
(1, 1, '12 rue du Commerce, 75001 Paris', 12600.00, 'completed', '2025-11-19 10:07:12'),
(2, 3, '8 rue de la Paix, 75002 Paris', 5200.00, 'pending', '2025-11-19 10:07:12');

-- --------------------------------------------------------

--
-- Structure de la table `Order_item`
--

CREATE TABLE `Order_item` (
  `order_item_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_unit` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Order_item`
--

INSERT INTO `Order_item` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price_unit`) VALUES
(1, 1, 1, 1, 12500.00),
(2, 1, 14, 1, 100.00),
(3, 2, 3, 1, 5200.00);

-- --------------------------------------------------------

--
-- Structure de la table `PaymentMethod`
--

CREATE TABLE `PaymentMethod` (
  `payment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `titulaire` varchar(150) NOT NULL,
  `type` enum('Visa','MasterCard','American Express') NOT NULL,
  `numero_masque` varchar(30) NOT NULL,
  `expiry` varchar(7) NOT NULL,
  `parDefaut` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `category` enum('Montre','Sac','Bijoux') DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `note` decimal(2,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`product_id`, `product_name`, `description`, `price`, `stock`, `category`, `image`, `note`) VALUES
(1, 'Rolex Submariner', 'Montre plongée iconique, boîtier acier, mouvement automatique.', 12500.00, 5, 'Montre', '/images/rolex_submariner.png', 4.9),
(2, 'Rolex Datejust', 'Classique Rolex, boîtier acier & or, bracelet Jubilee.', 9800.00, 3, 'Montre', '/images/rolex.png', 4.8),
(3, 'Omega Seamaster', 'Montre de plongée Omega, résistante et précise.', 5200.00, 7, 'Montre', '/images/omega_seamaster.png', 4.7),
(4, 'Omega Speedmaster', 'Chronographe historique, la « Moonwatch ».', 6100.00, 4, 'Montre', '/images/omega.png', 4.8),
(5, 'Patek Philippe Calatrava', 'Montre habillée Patek, finition haut-de-gamme.', 28500.00, 2, 'Montre', '/images/patek.png', 5.0),
(6, 'Audemars Piguet Royal Oak', 'Sport-chic, boîtier octogonal iconique.', 34000.00, 1, 'Montre', '/images/ap_royal.png', 5.0),
(7, 'Tag Heuer Carrera', 'Chronographe sportif, design racing.', 3300.00, 8, 'Montre', '/images/tag_carrera.png', 4.6),
(8, 'Breitling Navitimer', 'Chronographe pilote avec règle à calcul.', 7400.00, 3, 'Montre', '/images/breitling.png', 4.7),
(9, 'Vacheron Constantin Patrimony', 'Montre classique ultra-élégante.', 22000.00, 2, 'Montre', '/images/vacheron_patrimony.png', 4.9),
(11, 'Hermès Kelly 28', 'Sac Kelly, poignée élégante et fermeture signature.', 8600.00, 1, 'Sac', '/images/hermès_kelly.png', 4.8),
(12, 'Luis Vuiton ', 'Sac matelassé Chanel, bandoulière chaîne.', 7200.00, 4, 'Sac', '/images/chanel.webp', 4.5),
(13, 'Dior Lady Dior', 'Sac iconique Dior, matelassé cannage.', 5400.00, 5, 'Sac', '/images/dior_lady_dior.png', 4.7),
(14, 'Louis Vuitton Speedy 30', 'Sac LV Speedy en toile Monogram.', 1150.00, 10, 'Sac', '/images/lv_speedy.png', 4.6),
(15, 'Louis Vuitton Neverfull MM', 'Cabas spacieux LV Neverfull.', 1350.00, 8, 'Sac', '/images/lv_neverfull.png', 4.6),
(16, 'Gucci Marmont Small', 'Sac bandoulière Gucci en cuir matelassé.', 2100.00, 6, 'Sac', '/images/gucci_marmont.jpg', 4.5),
(17, 'Gucci Ophidia GG', 'Sac avec toile GG et bandes signature.', 1600.00, 5, 'Sac', '/images/gucci_ophidia.png', 4.4),
(18, 'Dior Saddle', 'Sac Saddle Dior, silhouette reconnaissable.', 3200.00, 3, 'Sac', '/images/dior_saddle.png', 4.6),
(19, 'Chanel Boy Bag', 'Sac Chanel Boy en cuir matelassé.', 6800.00, 3, 'Sac', '/images/chanel_boy.jpeg', 4.8),
(20, 'Dior Book Tote', 'Sac cabas Dior Book Tote brodé.', 2900.00, 6, 'Sac', '/images/dior_book_tote.jpeg', 4.5),
(21, 'Louis Vuitton Alma PM', 'Sac Alma iconique en Monogram.', 1500.00, 5, 'Sac', '/images/lv_alma.png', 4.5),
(22, 'Gucci Dionysus', 'Sac à boucle tigre signature.', 2500.00, 4, 'Sac', '/images/gucci_dionysus.png', 4.6),
(23, 'YSL Loulou Medium', 'Sac Saint Laurent matelassé.', 2600.00, 5, 'Sac', '/images/ysl_loulouysl.png', 4.7),
(24, 'YSL Kate', 'Sac YSL Kate en cuir lisse.', 1950.00, 7, 'Sac', '/images/ysl_kate.png', 4.6),
(25, 'Prada Galleria', 'Sac Prada Saffiano classique.', 2300.00, 6, 'Sac', '/images/prada_galleria.png', 4.7),
(26, 'Prada Re-Edition 2005', 'Mini sac nylon Prada.', 1150.00, 10, 'Sac', '/images/prada_reedition.png', 4.5),
(27, 'Balenciaga Hourglass', 'Sac Hourglass signature.', 2500.00, 4, 'Sac', '/images/balenciaga_hourglass.png', 4.4),
(28, 'Rolex GMT-Master II', 'Montre Rolex pour voyageurs.', 14800.00, 3, 'Montre', '/images/rolex_gmt.png', 4.9),
(29, 'Rolex Daytona', 'Chronographe Rolex très recherché.', 29500.00, 2, 'Montre', '/images/rolex_daytona.png', 5.0),
(30, 'Omega Aqua Terra', 'Montre élégante polyvalente.', 4500.00, 7, 'Montre', '/images/omega_aqua_terra.png', 4.6),
(31, 'Omega De Ville Prestige', 'Montre habillée classique.', 3800.00, 6, 'Montre', '/images/omega_de_ville.png', 4.5),
(32, 'Tag Heuer Monaco', 'Montre carrée iconique.', 5900.00, 5, 'Montre', '/images/tag_monaco.png', 4.7),
(33, 'Tag Heuer Formula 1', 'Montre sportive accessible.', 1850.00, 10, 'Montre', '/images/tag_formula.png', 4.4),
(34, 'Breitling Superocean', 'Montre de plongée pro.', 5200.00, 4, 'Montre', '/images/breitling_superocean.png', 4.6),
(35, 'Breitling Chronomat', 'Chronographe puissant.', 8500.00, 3, 'Montre', '/images/breitling_chronomat.png', 4.7),
(36, 'Audemars Piguet Royal Oak Offshore', 'Version sportive Royal Oak.', 38000.00, 1, 'Montre', '/images/ap_offshore.png', 4.9),
(37, 'Audemars Piguet Millenary', 'Modèle ovale unique.', 21000.00, 2, 'Montre', '/images/ap_millenary.png', 4.8),
(38, 'Patek Philippe Nautilus', 'Modèle sportif très recherché.', 52000.00, 1, 'Montre', '/images/patek_nautilus.png', 5.0),
(39, 'Patek Philippe Aquanaut', 'Montre sport-luxe moderne.', 39000.00, 1, 'Montre', '/images/patek_aquanaut.png', 4.9),
(40, 'Vacheron Constantin Fiftysix', 'Montre moderne VC.', 17000.00, 2, 'Montre', '/images/vc_fiftysix.png', 4.7),
(41, 'Vacheron Constantin Overseas', 'Montre sport-chic.', 23000.00, 1, 'Montre', '/images/vc_overseas.png', 4.8),
(42, 'Bulgari Serpenti', 'Montre serpentine bijou.', 8900.00, 3, 'Montre', '/images/bulgari_serpenti.png', 4.5),
(43, 'Bulgari B.Zero1', 'Bague iconique B.Zero1.', 1500.00, 12, 'Bijoux', '/images/bulgari_bzero1.png', 4.6),
(44, 'Cartier Tank Louis', 'Montre Cartier historique.', 10200.00, 4, 'Montre', '/images/cartier_tank.png', 4.8),
(45, 'Cartier Love Bracelet', 'Bracelet Love en or.', 6900.00, 8, 'Bijoux', '/images/cartier_love.png', 4.9),
(46, 'Chanel J12', 'Montre céramique noire.', 7200.00, 5, 'Montre', '/images/chanel_j12.png', 4.7),
(47, 'Chanel Gabrielle Bag', 'Sac Gabrielle en cuir.', 5300.00, 3, 'Sac', '/images/chanel_gabrielle.png', 4.6),
(48, 'Dior Caro Bag', 'Sac Dior Caro matelassé.', 3800.00, 4, 'Sac', '/images/dior_caro.png', 4.6),
(49, 'Dior Bobby', 'Sac Dior arrondi.', 3200.00, 5, 'Sac', '/images/dior_bobby.png', 4.5),
(50, 'Collier Or 18K', 'Collier en or 18 carats élégant pour femme.', 450.00, 15, 'Bijoux', '/images/collier_or.png', 4.2),
(51, 'Bracelet Diamant', 'Bracelet serti de petits diamants véritables.', 890.00, 8, 'Bijoux', '/images/bracelet_diamant.png', 4.4),
(52, 'Bague Saphir Bleu', 'Bague en argent incrustée d’un saphir bleu.', 650.00, 10, 'Bijoux', '/images/bague_saphir.png', 4.3),
(53, 'Boucles d’Oreilles Or', 'Paire de boucles en or massif.', 280.00, 25, 'Bijoux', '/images/boucles_or..png', 4.1),
(54, 'Montre Or Femme', 'Montre bracelet en or, édition luxe.', 1200.00, 5, 'Bijoux', '/images/montre_or_femme.png', 4.3),
(55, 'Collier Perles', 'Collier composé de perles fines naturelles.', 330.00, 18, 'Bijoux', '/images/collier_perles.png', 4.2),
(56, 'Bracelet Argent', 'Bracelet en argent véritable 925.', 150.00, 30, 'Bijoux', '/images/bracelet_argent.png', 4.0),
(57, 'Bague Rubis Rouge', 'Bague élégante avec un rubis rouge profond.', 720.00, 12, 'Bijoux', '/images/bague_rubis.png', 4.4),
(58, 'Chaîne Or Homme', 'Chaîne en or massif pour homme.', 990.00, 6, 'Bijoux', '/images/chaine_or_homme.png', 4.3),
(59, 'Collier Coeur Diamant', 'Collier cœur serti d’un diamant central.', 540.00, 9, 'Bijoux', '/images/collier.png', 4.4),
(60, 'Bracelet Or Rose', 'Bracelet moderne en or rose 18k.', 260.00, 22, 'Bijoux', '/images/bracelet_or_rose.png', 4.2),
(61, 'Boucles Saphir', 'Boucles d’oreilles décorées de saphirs bleus.', 340.00, 19, 'Bijoux', '/images/boucles_saphir.png', 4.3),
(62, 'Bague Émeraude', 'Bague classique sertie d’une émeraude.', 780.00, 14, 'Bijoux', '/images/bague_emeraude.png', 4.4),
(63, 'Bracelet Cuir & Or', 'Bracelet mix cuir noir et or.', 200.00, 17, 'Bijoux', '/images/bracelet_cuir_or.png', 4.1),
(64, 'Pendentif Lune Argent', 'Pendentif en forme de lune en argent.', 120.00, 35, 'Bijoux', '/images/pendentif_lune.png', 4.0),
(65, 'Collier Croix Or', 'Collier croix en or jaune 18k.', 310.00, 10, 'Bijoux', '/images/collier_croix_or.png', 4.3),
(66, 'Boucles Or Blanc', 'Boucles d’oreilles en or blanc poli.', 390.00, 13, 'Bijoux', '/images/boucles_or_blanc.png', 4.2),
(67, 'Bague Solitaire Diamant', 'Bague solitaire en diamant haut de gamme.', 1450.00, 4, 'Bijoux', '/images/bague_solitaire.png', 4.9),
(68, 'Bracelet Perles Noires', 'Bracelet perles noires naturelles.', 190.00, 28, 'Bijoux', '/images/bracelet_perles_noires.png', 4.1),
(69, 'Pendentif Papillon Or', 'Pendentif papillon en or 18k.', 240.00, 20, 'Bijoux', '/images/pendentif_papillon.png', 4.2);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `user_id` int NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`user_id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Sophie', 'Martin', 'sophie@example.com', 'password123', 'user', '2025-11-30 17:10:17', '2025-11-30 17:10:17'),
(2, 'Marc', 'Dupont', 'marc@example.com', 'password123', 'user', '2025-11-30 17:10:17', '2025-11-30 17:10:17'),
(3, 'sheymaa', 'Bernard', 'sheymaa@example.com', 'password123', 'user', '2025-11-30 17:10:17', '2025-11-30 17:10:17'),
(4, 'amad', 'khaly', 'diallo@gmail.com', '$2b$10$DSSqLAq5M3scIQ98RUrZbON.dmqbygvI5aCXjq1ErJXXuhrAc6GqG', 'user', '2025-11-30 19:04:23', '2025-11-30 19:04:23'),
(5, 'mqlsdk', 'qdklfu', 'ama@gmail.com', '$2b$10$n3TQzdMu3/fqyWnikNoeBuz7LI13f7ILqzpTJuhm946gGhLqttwzu', 'user', '2025-11-30 20:07:38', '2025-11-30 20:07:38'),
(6, 'amine', 'oucheikh', 'amine@gmail.com', '$2b$10$SDLs6t2waUnDg.OPZlfQ.e4mZFRU1GBNOV7vNAqFb/2IM0.Ix2yJK', 'user', '2025-11-30 20:10:39', '2025-11-30 20:10:39'),
(7, 'harouna', 'soumare', 'soumare@gamil.com', '$2b$10$G9EGoCUHjqy5ROWR8.3i8OaLrLJqGKz52ebXqoY6ZyYMgdKdPmKki', 'user', '2025-12-01 08:33:06', '2025-12-01 08:33:06'),
(8, 'admin', 'admin', 'admin@gmail.com', '$2b$10$ZFwtsYeBgkBSf4OytK2muOW3MtUZjh8hIwJGwUmIW4CKF/hq.bc0q', 'admin', '2025-12-03 09:09:53', '2025-12-03 09:56:22');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Address`
--
ALTER TABLE `Address`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `address_user_fk` (`user_id`);

--
-- Index pour la table `Cart`
--
ALTER TABLE `Cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `Cart_item`
--
ALTER TABLE `Cart_item`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favorite_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `Order`
--
ALTER TABLE `Order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `Order_item`
--
ALTER TABLE `Order_item`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `PaymentMethod`
--
ALTER TABLE `PaymentMethod`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payment_user_fk` (`user_id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`product_id`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Address`
--
ALTER TABLE `Address`
  MODIFY `address_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Cart`
--
ALTER TABLE `Cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Cart_item`
--
ALTER TABLE `Cart_item`
  MODIFY `cart_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favorite_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `Order`
--
ALTER TABLE `Order`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Order_item`
--
ALTER TABLE `Order_item`
  MODIFY `order_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `PaymentMethod`
--
ALTER TABLE `PaymentMethod`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Address`
--
ALTER TABLE `Address`
  ADD CONSTRAINT `address_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Cart`
--
ALTER TABLE `Cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Cart_item`
--
ALTER TABLE `Cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `Cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Order`
--
ALTER TABLE `Order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Order_item`
--
ALTER TABLE `Order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Order` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `PaymentMethod`
--
ALTER TABLE `PaymentMethod`
  ADD CONSTRAINT `payment_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
