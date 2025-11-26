'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { Truck, Lock, CreditCard, RefreshCw, Watch, Diamond, ShoppingBag, Headphones, ShieldCheck } from "lucide-react";
import { ProductCard } from './components/ProductCard/page'
import Link from "next/link";
import { useState, useEffect } from "react";


export default function Home() {
  const [vedettes, setVedettes] = useState([]);
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?vedettes=true');
      if (!res.ok) throw new Error('Erreur lors du chargement des produits vedettes ');

      const data = await res.json();
      setVedettes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(vedettes);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroPretitle}>Une collection autonome.</span>
            <h1 className={styles.heroTitle}>L'Excellence <br /> à portée de main</h1>
            <p className={styles.heroSubtitle}>Découvrez notre sélection premium de produits soigneusement choisis pour leur qualité exceptionnelle.</p>
            <button className={styles.heroButton}>Découvrir la boutique.</button>
            <button className={styles.heroButton1}>Voir les catégories.</button>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/hero-image.jpg"
              alt="Hero Image"
              width={380}
              height={400}
            />
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <div className={styles.feature}>
              <div className={styles.bannerLogo}><Truck size={32} /></div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Livraison gratuite</div>
                <div className={styles.bannerSub}>Dès 50€ d'achat</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.bannerLogo}><Lock size={32} /></div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Garantie 2 ans</div>
                <div className={styles.bannerSub}>Sur tout nos produits</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.bannerLogo}><CreditCard size={32} /></div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Paiement sécurisé</div>
                <div className={styles.bannerSub}>SSL et 3D Secure</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.bannerLogo}><RefreshCw size={32} /></div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Retours faciles</div>
                <div className={styles.bannerSub}>30 jours satisfait ou remboursé</div>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.heading}>Catégories Populaires</h2>
          <p className={styles.subheading}>Explorez nos différentes catégories</p>

          <div className={styles.grid}>
            <Link href='/montre' className={styles.card}>
              <Image
                src="/images/montre.webp"
                alt="Montre en or sur fond satin"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Montres</h3>
            </Link>

            <Link href='/bijoux' className={styles.card}>
              <Image
                src="/images/bijoux.webp"
                alt="Bijoux en or et diamants"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Bijoux</h3>
            </Link>

            <Link href='/sacs' className={styles.card}>
              <Image
                src="/images/sacs.webp"
                alt="Sacs de luxe rose et marron"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Sacs</h3>
            </Link>
          </div>
        </section>



        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Produits Vedettes</h2>
            <button className={styles.heroButton1}>Voir Tout</button>
          </div>

          <div className={styles.productsGrid}>
            {vedettes.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>

        {/* New Arrival */}
        <section className={styles.newArrival}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Featured</span>
            <h2 className={styles.sectionTitle}>New Arrival</h2>
          </div>

          <div className={styles.arrivalGrid}>
            <div className={styles.largeTile}>
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                alt="New arrival"
                width={760}
                height={460}
                className={styles.image}
              />
              <div className={styles.tileOverlay}>
                <h3>PlayStation 5</h3>
                <p>Black and white version of the PS5 coming out on sale.</p>
                <a className={styles.tileCta}>Shop Now</a>
              </div>
            </div>

            <div className={styles.smallTiles}>
              <div className={styles.smallTile}>
                <Image src="https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=800&q=80" alt="women" width={400} height={220} className={styles.image} />
                <div className={styles.smallOverlay}>
                  <h4>Women's Collections</h4>
                  <p>Featured women collections that give you another vibe.</p>
                  <a className={styles.tileCta}>Shop Now</a>
                </div>
              </div>

              <div className={styles.smallTileRow}>
                <div className={styles.smallTileHalf}>
                  <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80" alt="speakers" width={400} height={180} className={styles.image} />
                  <div className={styles.smallOverlayMini}><h5>Speakers</h5><a className={styles.tileCta}>Shop Now</a></div>
                </div>
                <div className={styles.smallTileHalf}>
                  <Image src="/montre.avif" alt="perfume" width={400} height={180} className={styles.image} />
                  <div className={styles.smallOverlayMini}><h5>Perfume</h5><a className={styles.tileCta}>Shop Now</a></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Row */}
        <section className={styles.serviceRow}>
          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}><Truck size={20} /></div>
            <h5>FREE AND FAST DELIVERY</h5>
            <p className={styles.muted}>Free delivery for all orders over $140</p>
          </div>

          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}><Headphones size={20} /></div>
            <h5>24/7 CUSTOMER SERVICE</h5>
            <p className={styles.muted}>Friendly 24/7 customer support</p>
          </div>

          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}><ShieldCheck size={20} /></div>
            <h5>MONEY BACK GUARANTEE</h5>
            <p className={styles.muted}>We return money within 30 days</p>
          </div>
        </section>
      </main>
    </div>
  );
}
