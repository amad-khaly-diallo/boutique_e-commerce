import Link from 'next/link';
import styles from './footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    <div>
                        <h3 className={styles.brandTitle}>EliteShop</h3>
                        <p className={styles.brandText}>
                            Votre destination pour des produits de qualité premium à des prix compétitifs.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink} aria-label="Visiter Facebook">
                                Facebook
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Visiter Instagram">
                                Instagram
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Visiter Twitter">
                                Twitter
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Boutique</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/products" className={styles.link}>Tous les produits</Link></li>
                            <li><Link href="/categories" className={styles.link}>Catégories</Link></li>
                            <li><Link href="/deals" className={styles.link}>Promotions</Link></li>
                            <li><Link href="/new" className={styles.link}>Nouveautés</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Service Client</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/contact" className={styles.link}>Contact</Link></li>
                            <li><Link href="/shipping" className={styles.link}>Livraison</Link></li>
                            <li><Link href="/returns" className={styles.link}>Retours</Link></li>
                            <li><Link href="/faq" className={styles.link}>FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Contact</h4>
                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <span className={styles.contactLabel}>Adresse</span>
                                <span>123 Rue Commerce, 75001 Paris, France</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactLabel}>Téléphone</span>
                                <span>+33 1 23 45 67 89</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactLabel}>Email</span>
                                <span>contact@eliteshop.fr</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; 2024 EliteShop. Tous droits réservés.</p>
                    <div className={styles.policies}>
                        <Link href="/privacy" className={styles.policyLink}>
                            Confidentialité
                        </Link>
                        <Link href="/terms" className={styles.policyLink}>
                            Conditions
                        </Link>
                        <Link href="/cookies" className={styles.policyLink}>
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

