import { ProductCard } from '../components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function Cardcomponent() {
  // Exemples de produits pour la démonstration
  const sampleProducts = [
    {
      product_id: 1,
      product_name: 'Montre Chanel Premium',
      description: 'Montre de luxe avec bracelet en chaîne dorée et cadran noir élégant',
      price: 960,
      original_price: 1160,
      stock: 5,
      category: 'Montres',
      rating: 4.5,
      reviews: 65,
      image: null,
    },
    {
      product_id: 2,
      product_name: 'Sac à Main Cuir',
      description: 'Sac à main en cuir véritable avec finition premium',
      price: 450,
      original_price: 599,
      stock: 12,
      category: 'Accessoires',
      rating: 4.8,
      reviews: 128,
      image: null,
    },
    {
      product_id: 3,
      product_name: 'Parfum Exclusif',
      description: 'Parfum de luxe avec notes florales et boisées',
      price: 120,
      original_price: null,
      stock: 20,
      category: 'Parfums',
      rating: 4.2,
      reviews: 43,
      image: null,
    },
    {
      product_id: 4,
      product_name: 'Bracelet Diamant',
      description: 'Bracelet en or blanc avec diamants sertis',
      price: 2500,
      original_price: 3200,
      stock: 3,
      category: 'Bijoux',
      rating: 5.0,
      reviews: 25,
      image: null,
    },
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Bienvenue chez EliteShop</h1>
          <p className={styles.subtitle}>
            Découvrez notre collection de produits premium
          </p>
        </div>

        <section className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Produits en vedette</h2>
          <div className={styles.productsGrid}>
            {sampleProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
