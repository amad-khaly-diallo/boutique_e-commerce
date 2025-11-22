import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroPretitle}>
              Une collection autonome.
            </span>
            <h1 className={styles.heroTitle}>
              L'Excellence <br /> à portée de main
            </h1>
            <p className={styles.heroSubtitle}>
              Découvrez notre sélection premium de produits <br /> soigneusement
              choisis pour leur qualité <br /> exceptionnelle.
            </p>
            <button className={styles.heroButton}>
              Découvrir la boutique.
            </button>
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
              <div className={styles.bannerLogo}>
                <Image
                  src="/images/logo-voiture.png"
                  alt="Hero Image"
                  width={380}
                  height={400}
                />
              </div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Livraison gratuite</div>
                <div className={styles.bannerSub}>Dès 50€ d'achat </div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.bannerLogo}>
                <Image
                  src="/images/logo-cadenas.png"
                  alt="Hero Image"
                  width={380}
                  height={400}
                />
              </div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Garantie 2 ans</div>
                <div className={styles.bannerSub}> Sur tout nos produits </div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.bannerLogo}>
                <Image
                  src="/images/logo-cartebleu.png"
                  alt="Hero Image"
                  width={380}
                  height={400}
                />
              </div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Paiement sécurisé</div>
                <div className={styles.bannerSub}>SSL et 3D Secure </div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.bannerLogo}>
                <Image
                  src="/images/logo-fleche.png"
                  alt="Retours faciles"
                  width={380}
                  height={400}
                />
              </div>
              <div className={styles.bannerDetails}>
                <div className={styles.bannerTitle}>Retours faciles</div>
                <div className={styles.bannerSub}>
                  30 jours satisfait ou remboursé
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className={styles.section}>
          <h2 className={styles.heading}>Catégories Populaires</h2>
          <p className={styles.subheading}>
            Explorez nos différentes catégories
          </p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <Image
                src="/images/montre.jpg"
                alt="Montre en or sur fond satin"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Montres</h3>
            </div>

            <div className={styles.card}>
              <Image
                src="/images/bijoux.jpg"
                alt="Bijoux en or et diamants"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Bijoux</h3>
            </div>

            <div className={styles.card}>
              <Image
                src="/images/sacs.jpg"
                alt="Sacs de luxe rose et marron"
                width={300}
                height={200}
                className={styles.image}
              />
              <h3 className={styles.title}>Sacs</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
