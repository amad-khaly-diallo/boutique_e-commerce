"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard/ProductCard";
import styles from "./page.module.css";
import Golden from "../components/GoldenBotton/GoldenBotton";

const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "montre", label: "Montres" },
  { value: "bijou", label: "Bijoux" },
  { value: "sac", label: "Sacs" }
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortOption, setSortOption] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  // --- Fetch depuis l'API ---
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Ajouter category et maxPrice dans la query si besoin
        let url = `/api/products?page=${page}&limit=${limit}`;
        if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;

        const res = await fetch(url);
        const json = await res.json();

        if (!isMounted) return;

        setProducts(Array.isArray(json.data) ? json.data : []);
        setTotal(typeof json.total === "number" ? json.total : 0);
      } catch (err) {
        console.error("Erreur fetch produits:", err);
        if (isMounted) {
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [page, selectedCategory, maxPrice]);

  // --- Tri côté client ---
  const sortedProducts = products.slice().sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "rating-desc") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

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
        <div className={styles.filtersCard} aria-label="Filtres">
          <div className={styles.filtersHeader}>
            <p>Filtres</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setMaxPrice(2000000);
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
              min="2000"
              max="2000000"
              step="10"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <div className={styles.priceScale}>
              <span>2000 €</span>
              <span>2000000 €</span>
            </div>
          </div>
        </div>

        <div className={styles.productsHeader}>
          <div>
            <p className={styles.resultsCount}>{total} produits trouvés</p>
            <p className={styles.resultsHint}>
              Filtrez par catégorie ou ajustez le budget pour trouver l’article idéal.
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

        <div className={styles.productsPanel} role="region" aria-label="Liste des produits">
          <div className={styles.grid}>
            {loading ? (
              <p>Chargement...</p>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))
            ) : (
              <p>Aucun produit disponible.</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className={styles.paginationContainer}>
          <Golden
            className={styles.paginationButton}
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Précédent
          </Golden>

          <span className={styles.paginationText}>
            Page {page} / {totalPages || 1}
          </span>

          <Golden
            className={styles.paginationButton}
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Suivant
          </Golden>
        </div>
      </section>
    </main>
  );
}
