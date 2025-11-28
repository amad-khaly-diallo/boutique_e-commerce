"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard/ProductCard";
import styles from "./page.module.css";

const PRODUCTS = [
  {
    product_id: "vitamine-c",
    product_name: "Sérum Vitamine C Bio",
    category: "beauté",
    description: "Sérum anti-âge 30ml",
    price: 45,
    original_price: 60,
    rating: 4.8,
    reviews: 120,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "yoga-premium",
    product_name: "Tapis de Yoga Premium",
    category: "sport",
    description: "Tapis de yoga 6mm - Violet",
    price: 49,
    original_price: 69,
    rating: 4.6,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "lampe-led",
    product_name: "Lampe Architecte LED",
    category: "maison",
    description: "Lampe de bureau réglable",
    price: 79,
    original_price: 99,
    rating: 4.7,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "montre-connectee",
    product_name: "Montre Connectée Sport",
    category: "tech",
    description: "Smartwatch GPS - Noir",
    price: 249,
    original_price: 289,
    rating: 4.4,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "veste-cuir",
    product_name: "Veste en Cuir Premium",
    category: "mode",
    description: "Veste en cuir véritable - Noir",
    price: 299,
    original_price: 389,
    rating: 4.9,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "casque-sony",
    product_name: "Sony WH-1000XM5",
    category: "tech",
    description: "Casque audio Bluetooth",
    price: 399,
    original_price: 449,
    rating: 4.8,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "canape-scandinave",
    product_name: "Canapé Scandinave 3 Places",
    category: "maison",
    description: "Canapé 3 places - Gris clair",
    price: 899,
    original_price: 1090,
    rating: 4.3,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "iphone-15-pro",
    product_name: "iPhone 15 Pro",
    category: "tech",
    description: "iPhone 15 Pro 256 Go - Titane",
    price: 1229,
    original_price: 1329,
    rating: 4.7,
    reviews: 643,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
  },
  {
    product_id: "monitor-uhd",
    product_name: "Écran Ultra HD 32''",
    category: "tech",
    description: "Moniteur 4K - Cadre fin",
    price: 499,
    original_price: 599,
    rating: 4.6,
    reviews: 231,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "beauté", label: "Beauté & Bien-être" },
  { value: "sport", label: "Sport & Fitness" },
  { value: "maison", label: "Maison & Décoration" },
  { value: "tech", label: "Tech & Gadgets" },
  { value: "mode", label: "Mode & Accessoires" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortOption, setSortOption] = useState("price-asc");

  const filteredProducts = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => {
      const inCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const inPriceRange = product.price <= maxPrice;
      return inCategory && inPriceRange;
    });

    return [...filtered].sort((a, b) => {
      if (sortOption === "price-asc") {
        return a.price - b.price;
      }
      if (sortOption === "price-desc") {
        return b.price - a.price;
      }
      return b.rating - a.rating;
    });
  }, [selectedCategory, maxPrice, sortOption]);

  return (
    <main className={styles.main}>
      <section className={styles.pageTitle}>
        <div className={styles.pageTitleContent}>
          <div className={styles.titleWrapper}>
            <p className={styles.kicker}>Catalogue complet • EliteShop</p>
            <h1>Tous les Produits</h1>
            <p className={styles.subtitle}>
              Découvrez notre sélection exclusive de produits de luxe, alliant élégance, innovation et style pour chaque moment de votre vie.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.catalogLayout}>

          <div className={styles.productsPanel}>
            <div className={styles.filtersCard}>
              <div className={styles.filtersHeader}>
                <p>Filtres</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setMaxPrice(3000);
                    setSortOption("price-asc");
                  }}
                >
                  Réinitialiser
                </button>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="category">Catégorie</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.priceHeader}>
                  <label htmlFor="price">Prix</label>
                  <span>{maxPrice} €</span>
                </div>
                <input
                  id="price"
                  type="range"
                  min="0"
                  max="3000"
                  step="10"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                />
                <div className={styles.priceScale}>
                  <span>0 €</span>
                  <span>3000 €</span>
                </div>
              </div>
            </div>
            <div className={styles.productsHeader}>
              <div>
                <p className={styles.resultsCount}>
                  {filteredProducts.length} produits trouvés
                </p>
                <p className={styles.resultsHint}>
                  Filtrez par catégorie ou ajustez le budget pour trouver l’article
                  idéal.
                </p>
              </div>
              <div className={styles.sortWrapper}>
                <label htmlFor="sort">Trier par</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                  >
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="rating-desc">Meilleures notes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
