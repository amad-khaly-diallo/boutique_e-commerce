"use client";
import Golden from "@/app/components/GoldenBotton/GoldenBotton";
import { useEffect, useState } from "react";
import { ProductCard } from "@/app/components/ProductCard/ProductCard";
import styles from "../page.module.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";


export default function BijouxPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(false);
  const [luxeLoading, setluxeLoading] = useState(true);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToPage = (newPage) => {
    setFade(true);
    setPage(newPage);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/products?category=Montre&page=${page}&limit=${limit}`
        );

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des montres");
        }

        const { data, total } = await res.json();

        // <-- correction ici :
        if (Array.isArray(data)) {
          setProducts(data);
          setTotal(total);
        } else {
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setFade(false);
      }
    };

    fetchProducts();
    setTimeout(() => {
      setluxeLoading(false)
    }, 1000);
  }, [page, limit]);

  return (
    <main className={styles.main}>
      {luxeLoading && <LuxuryLoader />}
      <section className={styles.pageTitle}>
        <div className={styles.pageTitleContent}>
          <div className={styles.titleWrapper}>
            <p className={styles.kicker}>Catégorie • Montres de luxe</p>
            <h1>Montres d’Exception</h1>
            <p className={styles.subtitle}>
              Découvrez notre sélection de montres de prestige : Rolex, Omega, Patek Philippe, Audemars Piguet et plus encore.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.catalogLayout}>
          <div className={styles.productsPanel}>
            <div className={styles.productsHeader}>
              <div>
                <p className={styles.resultsCount}>
                  {isLoading ? "Chargement des bijoux…" : `${total} bijoux trouvés`}
                </p>
                <p className={styles.resultsHint}>
                  Découvrez notre collection de bijoux raffinés pour sublimer chaque tenue.
                </p>
              </div>
            </div>

            {error && (
              <p className={styles.resultsHint} style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}

            <div className={`${styles.grid} ${fade ? styles.fadeOut : styles.fadeIn}`}>
              {!isLoading &&
                !error &&
                products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
            </div>

            {/* PAGINATION */}
            {!isLoading && !error && total > 0 && (
              <div className={styles.paginationWrapper}>
                <Golden
                  disabled={page <= 1}
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  className={styles.paginationButton}
                >
                  Précédent
                </Golden>

                <span className={styles.paginationInfo}>
                  Page {page} / {totalPages}
                </span>

                <Golden
                  disabled={page >= totalPages}
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  className={styles.paginationButton}
                >
                  Suivant
                </Golden>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
