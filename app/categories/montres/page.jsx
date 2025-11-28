'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/app/components/ProductCard/productCard';
import styles from '../page.module.css'

export default function MontresPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?category=Montre');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des montres');
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
                  {isLoading
                    ? 'Chargement des montres…'
                    : `${products.length} montres trouvées`}
                </p>
                <p className={styles.resultsHint}>
                  Toutes les pièces horlogères disponibles actuellement dans notre boutique.
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


