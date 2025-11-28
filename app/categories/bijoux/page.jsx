'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/app/components/ProductCard/ProductCard';
import styles from '../page.module.css'

export default function BijouxPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?category=Bijoux');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des bijoux');
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
            <p className={styles.kicker}>Catégorie • Bijoux de luxe</p>
            <h1>Bijoux d’Exception</h1>
            <p className={styles.subtitle}>
              Sélection précieuse de bijoux emblématiques : Cartier, Bulgari et autres maisons d’exception.
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
                    ? 'Chargement des bijoux…'
                    : `${products.length} bijoux trouvés`}
                </p>
                <p className={styles.resultsHint}>
                  Découvrez notre collection de bijoux raffinés pour sublimer chaque tenue.
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


