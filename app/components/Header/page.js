'use client';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Heart, X } from 'lucide-react';
import { useState } from 'react';
import styles from './header.module.css';

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <div className={styles.navRow}>
                    <div className={styles.brandCluster}>
                        <Link href="/" className={styles.logoLink}>
                            <div className={styles.logoMark}>
                                <ShoppingCart className={styles.logoIcon} />
                            </div>
                            <span className={styles.logoText}>EliteShop</span>
                        </Link>

                        <div className={styles.navLinks}>
                            <Link href="/products" className={styles.navLink}>
                                Produits
                            </Link>
                            <Link href="/categories" className={styles.navLink}>
                                Catégories
                            </Link>
                            <Link href="/deals" className={styles.navLink}>
                                Promotions
                            </Link>
                            <Link href="/about" className={styles.navLink}>
                                À propos
                            </Link>
                        </div>
                    </div>

                    <div className={styles.searchWrapper}>
                        <div className={styles.searchField}>
                            <Search className={styles.searchIcon} />
                            <input
                                placeholder="Rechercher des produits..."
                                className={styles.searchInput}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={`${styles.iconButton} ${styles.favorites}`} aria-label="Voir les favoris">
                            <Heart className="h-5 w-5" />
                        </button>

                        <Link href="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="Voir le panier">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                        </Link>

                        <Link href="/account" className={styles.iconButton} aria-label="Voir le compte">
                            <User className="h-5 w-5" />
                        </Link>

                        <button
                            type="button"
                            className={`${styles.iconButton} ${styles.mobileToggle}`}
                            aria-label="Ouvrir le menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className={styles.mobileOverlay} onClick={() => setIsMenuOpen(false)}>
                    <div className={styles.mobilePanel} onClick={(event) => event.stopPropagation()}>
                        <div className={styles.mobileHeading}>
                            <span className={styles.logoText}>EliteShop</span>
                            <button
                                type="button"
                                className={styles.mobileClose}
                                aria-label="Fermer le menu"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <X className={styles.mobileCloseIcon} />
                            </button>
                        </div>
                        <div className={styles.mobileMenu}>
                            <Link href="/products" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                                Produits
                            </Link>
                            <Link
                                href="/categories"
                                className={`${styles.mobileLink} ${styles.mobileSubtle}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Catégories
                            </Link>
                            <Link
                                href="/deals"
                                className={`${styles.mobileLink} ${styles.mobileSubtle}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Promotions
                            </Link>
                            <Link
                                href="/about"
                                className={`${styles.mobileLink} ${styles.mobileSubtle}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                À propos
                            </Link>
                            <div className={styles.mobileAdmin}>
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                                    Administration
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

