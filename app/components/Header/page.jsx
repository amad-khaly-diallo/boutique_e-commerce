'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useCartContext } from '@/app/contexts/CartContext';
import { useUserContext } from '@/app/contexts/UserContext';
import { useToastContext } from '@/app/contexts/ToastContext';
import styles from './header.module.css';

const NAV_LINKS = [
    { href: '/products', label: 'Produits' },
    { href: '/about', label: 'À propos' },
    { href: '/login', label: 'Connectez-vous' },
];

const CATEGORY_LINKS = [
    { href: '/categories/montres', label: 'Montres' },
    { href: '/categories/sacs', label: 'Sacs de luxe' },
    { href: '/categories/bijoux', label: 'Bijoux' },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount } = useCartContext();
    const { user, logout: logoutUser } = useUserContext();
    const toast = useToastContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const userMenuRef = useRef(null);
    const isCategorySection = pathname?.startsWith('/categories');

    //pour la bar de recherche
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Éviter les problèmes d'hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fermer le menu utilisateur si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    // Fonction de déconnexion
    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            setIsUserMenuOpen(false);
            toast.success("Déconnexion réussie");
            router.push("/");
        } else {
            toast.error(result.error || "Erreur lors de la déconnexion");
        }
    };



    useEffect(() => {
        if (!search || search.length < 2) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const delay = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products/search?query=${search}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                if (err.name !== "AbortError") console.error(err);
            }
        }, 300);

        return () => {
            clearTimeout(delay);
            controller.abort();
        };
    }, [search]);



    const desktopLinks = useMemo(() => {
        // Filtrer les liens : ne pas afficher "Connectez-vous" si l'utilisateur est connecté
        const links = NAV_LINKS.filter(link => {
            if (link.href === '/login' && user) {
                return false; // Cacher "Connectez-vous" si connecté
            }
            return true;
        });
        
        // Ajouter le lien Admin seulement si l'utilisateur est admin
        if (user && user.role === 'admin') {
            links.push({ href: '/admin', label: 'Admin' });
        }
        
        return links.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
            >
                {link.label}
            </Link>
        ));
    }, [pathname, user]);

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
                            {desktopLinks}
                        </div>
                    </div>

                    <div className={styles.searchWrapper}>
                        <div className={styles.searchField}>
                            <Search className={styles.searchIcon} />

                            <input
                                placeholder="Votre recherche commence ici…"
                                className={styles.searchInput}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className={styles.suggestionsBox}>
                                {suggestions.map((item) => (
                                    <Link
                                        key={item.product_id}
                                        href={`/products/${item.product_id}`}
                                        className={styles.suggestionItem}
                                        onClick={() => setSearch("")}
                                    >
                                        <img src={item.image} className={styles.suggestionImg} />
                                        <span>{item.product_name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className={styles.actions}>
                        <Link href="/wishlist"
                            className={`${styles.iconButton} ${styles.favorites}`}
                            aria-label="Voir les favoris"
                        >
                            <Heart />
                        </Link>

                        <Link
                            href="/cart"
                            className={`${styles.iconButton} ${styles.cartButton}`}
                            aria-label="Voir le panier"
                        >
                            <ShoppingCart />
                            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                        </Link>

                        {user ? (
                            <div className={styles.userMenuWrapper} ref={userMenuRef}>
                                <button
                                    type="button"
                                    className={`${styles.iconButton} ${styles.userButton}`}
                                    aria-label="Menu utilisateur"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <User />
                                </button>
                                {isUserMenuOpen && (
                                    <div className={styles.userMenu}>
                                        <div className={styles.userMenuHeader}>
                                            <div className={styles.userInfo}>
                                                <p className={styles.userName}>
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className={styles.userEmail}>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className={styles.userMenuItems}>
                                            <Link
                                                href="/account"
                                                className={styles.userMenuItem}
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings size={18} />
                                                <span>Mon compte</span>
                                            </Link>
                                            <Link
                                                href="/account/orders"
                                                className={styles.userMenuItem}
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Package size={18} />
                                                <span>Mes commandes</span>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className={styles.userMenuItem}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Settings size={18} />
                                                    <span>Administration</span>
                                                </Link>
                                            )}
                                            <button
                                                type="button"
                                                className={`${styles.userMenuItem} ${styles.logoutButton}`}
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={18} />
                                                <span>Déconnexion</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/account" className={styles.iconButton} aria-label="Voir le compte">
                                <User />
                            </Link>
                        )}

                        <button
                            type="button"
                            className={`${styles.iconButton} ${styles.mobileToggle}`}
                            aria-label="Ouvrir le menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu />
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
                            {user ? (
                                <>
                                    <div className={styles.mobileUserInfo}>
                                        <p className={styles.mobileUserName}>
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className={styles.mobileUserEmail}>{user.email}</p>
                                    </div>
                                    <Link
                                        href="/account"
                                        className={`${styles.mobileLink} ${pathname === '/account' ? styles.mobileLinkActive : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Mon compte
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        className={`${styles.mobileLink} ${pathname === '/account/orders' ? styles.mobileLinkActive : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Mes commandes
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className={styles.mobileLink}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Administration
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        className={`${styles.mobileLink} ${styles.mobileLogout}`}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))
                            )}

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

                            {user && user.role === 'admin' && (
                                <div className={styles.mobileAdmin}>
                                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                                        Administration
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

