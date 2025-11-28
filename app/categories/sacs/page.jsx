'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/app/components/ProductCard/ProductCard';
import styles from '../page.module.css';

export default function SacsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?category=Sac');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des sacs');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.pageTitle}>
        <div className={styles.pageTitleContent}>
          <div className={styles.titleWrapper}>
            <p className={styles.kicker}>Catégorie • Sacs de luxe</p>
            <h1>Sacs d’Exception</h1>
            <p className={styles.subtitle}>
              Birkin, Kelly, Chanel Classic, Dior Lady… Retrouvez les sacs les plus iconiques des maisons de luxe.
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
                  {isLoading
                    ? 'Chargement des sacs…'
                    : `${products.length} sacs trouvés`}
                </p>
                <p className={styles.resultsHint}>
                  Toute notre sélection de sacs de luxe immédiatement disponibles.
                </p>
              </div>
            </div>

            {error && (
              <p className={styles.resultsHint} style={{ color: '#dc2626' }}>
                {error}
              </p>
            )}

            <div className={styles.grid}>
              {!isLoading &&
                !error &&
                products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


