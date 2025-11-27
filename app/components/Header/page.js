'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import styles from './header.module.css';

const NAV_LINKS = [
    { href: '/products', label: 'Produits' },
    { href: '/contact', label: 'Contactez-nous' },
    { href: '/about', label: 'À propos' },
];

const CATEGORY_LINKS = [
    { href: '/categories/montres', label: 'Montres' },
    { href: '/categories/sacs', label: 'Sacs de luxe' },
    { href: '/categories/bijoux', label: 'Bijoux' },
];

export default function Header() {
    const pathname = usePathname();
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isCategorySection = pathname?.startsWith('/categories');

    const desktopLinks = useMemo(
        () =>
            NAV_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                >
                    {link.label}
                </Link>
            )),
        [pathname],
    );

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
                            {desktopLinks}

                            <div className={styles.dropdown}>
                                <button
                                    type="button"
                                    className={`${styles.dropdownBtn} ${isCategorySection ? styles.navLinkActive : ''}`}
                                    aria-haspopup="true"
                                    aria-expanded={isCategorySection}
                                >
                                    Catégories
                                    <ChevronDown className={styles.dropdownIcon} />
                                </button>

                                <div className={styles.dropdownMenu}>
                                    <p className={styles.dropdownLabel}>Collections</p>
                                    <div className={styles.dropdownList}>
                                        {CATEGORY_LINKS.map((category) => (
                                            <Link key={category.href} href={category.href} className={styles.dropdownLink}>
                                                <span>{category.label}</span>
                                                <span className={styles.dropdownHint}>Voir la sélection</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.searchWrapper}>
                        <div className={styles.searchField}>
                            <Search className={styles.searchIcon} />
                            <input
                                placeholder="Rechercher une maison, une collection..."
                                className={styles.searchInput}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/wishlist"
                            className={`${styles.iconButton} ${styles.favorites}`}
                            aria-label="Voir les favoris"
                        >
                            <Heart className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/cart"
                            className={`${styles.iconButton} ${styles.cartButton}`}
                            aria-label="Voir le panier"
                        >
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
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${styles.mobileLink} ${
                                        pathname === link.href ? styles.mobileLinkActive : ''
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className={styles.mobileSection}>
                                <p className={styles.mobileSectionLabel}>Catégories</p>
                                <div className={styles.mobileCategories}>
                                    {CATEGORY_LINKS.map((category) => (
                                        <Link
                                            key={category.href}
                                            href={category.href}
                                            className={`${styles.mobileLink} ${styles.mobileSubtle}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {category.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

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

