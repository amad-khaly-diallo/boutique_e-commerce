"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/app/components/ProductCard/ProductCard";
import Golden from "@/app/components/GoldenBotton/GoldenBotton";
import styles from "../page.module.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import { useLuxuryLoader } from "@/lib/useLuxuryLoader";
import SchemaInjector from "@/app/components/Schema/SchemaInjector";

export default function BijouxPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoader = useLuxuryLoader(loading, 1000);

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
          `/api/products?category=Bijoux&page=${page}&limit=${limit}`
        );

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des bijoux");
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
    // Le loader sera visible au minimum 1000ms grâce à useLuxuryLoader
    setTimeout(() => {
      setLoading(false);
    }, 500); // Temps réel de chargement (peut être rapide)
  }, [page, limit]);

  // Schémas Schema.org
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bijoux d'Exception",
    "description": "Sélection précieuse de bijoux emblématiques : Cartier, Bulgari et autres maisons d'exception.",
    "url": `${baseUrl}/categories/bijoux`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": total,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.product_name,
          "url": `${baseUrl}/products/${product.product_id}`,
          "image": product.image 
            ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
            : `${baseUrl}/images/lux.png`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": parseFloat(product.price) || 0,
            "availability": product.stock > 0 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock"
          }
        }
      }))
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bijoux",
        "item": `${baseUrl}/categories/bijoux`
      }
    ]
  };

  return (
    <main className={styles.main}>
      <SchemaInjector schemas={[collectionSchema, breadcrumbSchema]} />
      {showLoader && <LuxuryLoader />}
      <section className={styles.pageTitle}>
        <div className={styles.pageTitleContent}>
          <div className={styles.titleWrapper}>
            <p className={styles.kicker}>Catégorie • Bijoux de luxe</p>
            <h1>Bijoux d’Exception</h1>
            <p className={styles.subtitle}>
              Sélection précieuse de bijoux emblématiques : Cartier, Bulgari et
              autres maisons d’exception.
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

            {}

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
