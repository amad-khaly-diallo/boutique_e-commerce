-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 28 nov. 2025 à 14:00
-- Version du serveur : 10.11.13-MariaDB-0ubuntu0.24.04.1
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
-- Structure de la table `Cart`
--

CREATE TABLE `Cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Cart`
--

INSERT INTO `Cart` (`cart_id`, `user_id`, `created_at`) VALUES
(1, 1, '2025-11-19 11:07:12'),
(2, 2, '2025-11-19 11:07:12');

-- --------------------------------------------------------

--
-- Structure de la table `Cart_item`
--

CREATE TABLE `Cart_item` (
  `cart_item_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Cart_item`
--

INSERT INTO `Cart_item` (`cart_item_id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 12, 1),
(2, 1, 13, 1),
(3, 2, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `Order`
--

CREATE TABLE `Order` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Order`
--

INSERT INTO `Order` (`order_id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES
(1, 1, 12600.00, 'completed', '2025-11-19 11:07:12'),
(2, 3, 5200.00, 'pending', '2025-11-19 11:07:12');

-- --------------------------------------------------------

--
-- Structure de la table `Order_item`
--

CREATE TABLE `Order_item` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_unit` decimal(10,2) NOT NULL
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
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`product_id`, `product_name`, `description`, `price`, `stock`, `category`, `image`, `note`) VALUES
(1, 'Rolex Submariner', 'Montre plongée iconique, boîtier acier, mouvement automatique.', 12500.00, 5, 'Montre', '/images/rolex_submariner.png', 'Icone sportive.'),
(2, 'Rolex Datejust', 'Classique Rolex, boîtier acier & or, bracelet Jubilee.', 9800.00, 3, 'Montre', '/images/rolex.png', 'Élégance intemporelle.'),
(3, 'Omega Seamaster', 'Montre de plongée Omega, résistante et précise.', 5200.00, 7, 'Montre', '/images/omega_seamaster.png', 'Précision suisse.'),
(4, 'Omega Speedmaster', 'Chronographe historique, la « Moonwatch ».', 6100.00, 4, 'Montre', '/images/omega.png', 'Légendaire.'),
(5, 'Patek Philippe Calatrava', 'Montre habillée Patek, finition haut-de-gamme.', 28500.00, 2, 'Montre', '/images/patek.png', 'Haute horlogerie.'),
(6, 'Audemars Piguet Royal Oak', 'Sport-chic, boîtier octogonal iconique.', 34000.00, 1, 'Montre', '/images/ap_royal.png', 'Pièce de collection.'),
(7, 'Tag Heuer Carrera', 'Chronographe sportif, design racing.', 3300.00, 8, 'Montre', '/images/tag_carrera.png', 'Sportive et précise.'),
(8, 'Breitling Navitimer', 'Chronographe pilote avec règle à calcul.', 7400.00, 3, 'Montre', '/images/breitling.png', 'Aéronautique.'),
(9, 'Vacheron Constantin Patrimony', 'Montre classique ultra-élégante.', 22000.00, 2, 'Montre', '/images/vacheron_patrimony.png', 'Savoir-faire suisse.'),
(11, 'Hermès Kelly 28', 'Sac Kelly, poignée élégante et fermeture signature.', 8600.00, 1, 'Sac', '/images/hermès_kelly.png', 'Raffinement parisien.'),
(12, 'Luis Vuiton ', 'Sac matelassé Chanel, bandoulière chaîne.', 7200.00, 4, 'Sac', '/images/chanel.webp', 'Élégance intemporelle.'),
(13, 'Dior Lady Dior', 'Sac iconique Dior, matelassé cannage.', 5400.00, 5, 'Sac', '/images/dior_lady_dior.png', 'Chic parisien.'),
(14, 'Louis Vuitton Speedy 30', 'Sac LV Speedy en toile Monogram.', 1150.00, 10, 'Sac', '/images/lv_speedy.png', 'Classique et pratique.'),
(15, 'Louis Vuitton Neverfull MM', 'Cabas spacieux LV Neverfull.', 1350.00, 8, 'Sac', '/images/lv_neverfull.png', 'Parfait pour tous les jours.'),
(16, 'Gucci Marmont Small', 'Sac bandoulière Gucci en cuir matelassé.', 2100.00, 6, 'Sac', '/images/gucci_marmont.jpg', 'Style moderne.'),
(17, 'Gucci Ophidia GG', 'Sac avec toile GG et bandes signature.', 1600.00, 5, 'Sac', '/images/gucci_ophidia.png', 'Heritage contemporain.'),
(18, 'Dior Saddle', 'Sac Saddle Dior, silhouette reconnaissable.', 3200.00, 3, 'Sac', '/images/dior_saddle.png', 'Tendance luxe.'),
(19, 'Chanel Boy Bag', 'Sac Chanel Boy en cuir matelassé.', 6800.00, 3, 'Sac', '/images/chanel_boy.jpeg', 'Moderne et iconique.'),
(20, 'Dior Book Tote', 'Sac cabas Dior Book Tote brodé.', 2900.00, 6, 'Sac', '/images/dior_book_tote.jpeg', 'Très tendance.'),
(21, 'Louis Vuitton Alma PM', 'Sac Alma iconique en Monogram.', 1500.00, 5, 'Sac', '/images/lv_alma.png', 'Intemporel.'),
(22, 'Gucci Dionysus', 'Sac à boucle tigre signature.', 2500.00, 4, 'Sac', '/images/gucci_dionysus.png', 'Luxe audacieux.'),
(23, 'YSL Loulou Medium', 'Sac Saint Laurent matelassé.', 2600.00, 5, 'Sac', '/images/ysl_loulouysl.png', 'Élégance parisienne.'),
(24, 'YSL Kate', 'Sac YSL Kate en cuir lisse.', 1950.00, 7, 'Sac', '/images/ysl_kate.png', 'Minimaliste chic.'),
(25, 'Prada Galleria', 'Sac Prada Saffiano classique.', 2300.00, 6, 'Sac', '/images/prada_galleria.png', 'Icône moderne.'),
(26, 'Prada Re-Edition 2005', 'Mini sac nylon Prada.', 1150.00, 10, 'Sac', '/images/prada_reedition.png', 'Très populaire.'),
(27, 'Balenciaga Hourglass', 'Sac Hourglass signature.', 2500.00, 4, 'Sac', '/images/balenciaga_hourglass.png', 'Contemporain.'),
(28, 'Rolex GMT-Master II', 'Montre Rolex pour voyageurs.', 14800.00, 3, 'Montre', '/images/rolex_gmt.png', 'Légendaire.'),
(29, 'Rolex Daytona', 'Chronographe Rolex très recherché.', 29500.00, 2, 'Montre', '/images/rolex_daytona.png', 'Modèle culte.'),
(30, 'Omega Aqua Terra', 'Montre élégante polyvalente.', 4500.00, 7, 'Montre', '/images/omega_aqua_terra.png', 'Polyvalente.'),
(31, 'Omega De Ville Prestige', 'Montre habillée classique.', 3800.00, 6, 'Montre', '/images/omega_de_ville.png', 'Élégante.'),
(32, 'Tag Heuer Monaco', 'Montre carrée iconique.', 5900.00, 5, 'Montre', '/images/tag_monaco.png', 'Design unique.'),
(33, 'Tag Heuer Formula 1', 'Montre sportive accessible.', 1850.00, 10, 'Montre', '/images/tag_formula.png', 'Sportive.'),
(34, 'Breitling Superocean', 'Montre de plongée pro.', 5200.00, 4, 'Montre', '/images/breitling_superocean.png', 'Robuste.'),
(35, 'Breitling Chronomat', 'Chronographe puissant.', 8500.00, 3, 'Montre', '/images/breitling_chronomat.png', 'Technique.'),
(36, 'Audemars Piguet Royal Oak Offshore', 'Version sportive Royal Oak.', 38000.00, 1, 'Montre', '/images/ap_offshore.png', 'Très exclusive.'),
(37, 'Audemars Piguet Millenary', 'Modèle ovale unique.', 21000.00, 2, 'Montre', '/images/ap_millenary.png', 'Original.'),
(38, 'Patek Philippe Nautilus', 'Modèle sportif très recherché.', 52000.00, 1, 'Montre', '/images/patek_nautilus.png', 'Rare.'),
(39, 'Patek Philippe Aquanaut', 'Montre sport-luxe moderne.', 39000.00, 1, 'Montre', '/images/patek_aquanaut.png', 'Très prisée.'),
(40, 'Vacheron Constantin Fiftysix', 'Montre moderne VC.', 17000.00, 2, 'Montre', '/images/vc_fiftysix.png', 'Très chic.'),
(41, 'Vacheron Constantin Overseas', 'Montre sport-chic.', 23000.00, 1, 'Montre', '/images/vc_overseas.png', 'Haute horlogerie.'),
(42, 'Bulgari Serpenti', 'Montre serpentine bijou.', 8900.00, 3, 'Montre', '/images/bulgari_serpenti.png', 'Très féminin.'),
(43, 'Bulgari B.Zero1', 'Bague iconique B.Zero1.', 1500.00, 12, 'Bijoux', '/images/bulgari_bzero1.png', 'Très chic.'),
(44, 'Cartier Tank Louis', 'Montre Cartier historique.', 10200.00, 4, 'Montre', '/images/cartier_tank.png', 'Classique.'),
(45, 'Cartier Love Bracelet', 'Bracelet Love en or.', 6900.00, 8, 'Bijoux', '/images/cartier_love.png', 'Iconique.'),
(46, 'Chanel J12', 'Montre céramique noire.', 7200.00, 5, 'Montre', '/images/chanel_j12.png', 'Très tendance.'),
(47, 'Chanel Gabrielle Bag', 'Sac Gabrielle en cuir.', 5300.00, 3, 'Sac', '/images/chanel_gabrielle.png', 'Luxe moderne.'),
(48, 'Dior Caro Bag', 'Sac Dior Caro matelassé.', 3800.00, 4, 'Sac', '/images/dior_caro.png', 'Élégant.'),
(49, 'Dior Bobby', 'Sac Dior arrondi.', 3200.00, 5, 'Sac', '/images/dior_bobby.png', 'Très chic.'),
(50, 'Collier Or 18K', 'Collier en or 18 carats élégant pour femme.', 450.00, 15, 'bijoux', '/images/collier_or.png', NULL),
(51, 'Bracelet Diamant', 'Bracelet serti de petits diamants véritables.', 890.00, 8, 'bijoux', '/images/bracelet_diamant.png', NULL),
(52, 'Bague Saphir Bleu', 'Bague en argent incrustée d’un saphir bleu.', 650.00, 10, 'bijoux', '/images/bague_saphir.png', NULL),
(53, 'Boucles d’Oreilles Or', 'Paire de boucles en or massif.', 280.00, 25, 'bijoux', '/images/boucles_or..png', NULL),
(54, 'Montre Or Femme', 'Montre bracelet en or, édition luxe.', 1200.00, 5, 'bijoux', '/images/montre_or_femme.png', NULL),
(55, 'Collier Perles', 'Collier composé de perles fines naturelles.', 330.00, 18, 'bijoux', '/images/collier_perles.png', NULL),
(56, 'Bracelet Argent', 'Bracelet en argent véritable 925.', 150.00, 30, 'bijoux', '/images/bracelet_argent.png', NULL),
(57, 'Bague Rubis Rouge', 'Bague élégante avec un rubis rouge profond.', 720.00, 12, 'bijoux', '/images/bague_rubis.png', NULL),
(58, 'Chaîne Or Homme', 'Chaîne en or massif pour homme.', 990.00, 6, 'bijoux', '/images/chaine_or_homme.png', NULL),
(59, 'Collier Coeur Diamant', 'Collier cœur serti d’un diamant central.', 540.00, 9, 'bijoux', '/images/collier.png', NULL),
(60, 'Bracelet Or Rose', 'Bracelet moderne en or rose 18k.', 260.00, 22, 'bijoux', '/images/bracelet_or_rose.png', NULL),
(61, 'Boucles Saphir', 'Boucles d’oreilles décorées de saphirs bleus.', 340.00, 19, 'bijoux', '/images/boucles_saphir.png', NULL),
(62, 'Bague Émeraude', 'Bague classique sertie d’une émeraude.', 780.00, 14, 'bijoux', '/images/bague_emeraude.png', NULL),
(63, 'Bracelet Cuir & Or', 'Bracelet mix cuir noir et or.', 200.00, 17, 'bijoux', '/images/bracelet_cuir_or.png', NULL),
(64, 'Pendentif Lune Argent', 'Pendentif en forme de lune en argent.', 120.00, 35, 'bijoux', '/images/pendentif_lune.png', NULL),
(65, 'Collier Croix Or', 'Collier croix en or jaune 18k.', 310.00, 10, 'bijoux', '/images/collier_croix_or.png', NULL),
(66, 'Boucles Or Blanc', 'Boucles d’oreilles en or blanc poli.', 390.00, 13, 'bijoux', '/images/boucles_or_blanc.png', NULL),
(67, 'Bague Solitaire Diamant', 'Bague solitaire en diamant haut de gamme.', 1450.00, 4, 'bijoux', '/images/bague_solitaire.png', NULL),
(68, 'Bracelet Perles Noires', 'Bracelet perles noires naturelles.', 190.00, 28, 'bijoux', '/images/bracelet_perles_noires.png', NULL),
(69, 'Pendentif Papillon Or', 'Pendentif papillon en or 18k.', 240.00, 20, 'bijoux', '/images/pendentif_papillon.png', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`user_id`, `first_name`, `last_name`, `email`, `password`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Sophie', 'Martin', 'sophie@example.com', 'password123', '12 rue du Commerce, 75001 Paris', '2025-11-19 11:07:12', '2025-11-19 11:07:12'),
(2, 'Marc', 'Dupont', 'marc@example.com', 'password123', '5 avenue Victor Hugo, 75016 Paris', '2025-11-19 11:07:12', '2025-11-19 11:07:12'),
(3, 'sheymaa', 'Bernard', 'sheymaa@example.com', 'password123', '8 rue de la Paix, 75002 Paris', '2025-11-19 11:07:12', '2025-11-19 11:11:53');

--
-- Index pour les tables déchargées
--

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
-- AUTO_INCREMENT pour la table `Cart`
--
ALTER TABLE `Cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Cart_item`
--
ALTER TABLE `Cart_item`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Order`
--
ALTER TABLE `Order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Order_item`
--
ALTER TABLE `Order_item`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
