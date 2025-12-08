import Link from 'next/link';
import './footer.css';

export default function Footer() {
    return (
        <>
            <footer className="auth-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Exclusive</h3>
                        <ul>
                            <li><a href="#"> abonnez-vous </a></li>
                            <li><input type="email" placeholder="Enter your email" /></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">123 rue de la paix </a></li>
                            <li><a href="tel:+8801688888899">+33 06 mais couille noir sa mere</a></li>
                            <li><a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>compte  </h3>
                        <ul>
                            <li><a href="/account">Mon compte </a></li>
                            <li><a href="/login">connexion / enregistrement </a></li>
                            <li><a href="/cart">Cart</a></li>
                            <li><Link href="/wishlist">Liste de souhaits</Link></li>
                            <li><a href="/checkout">Shop</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Lien rapide</h3>
                        <ul>
                            <li><Link href="/privacy">Politique de confidentialité</Link></li>
                            <li><Link href="/terms">Conditions d'utilisation</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p> &copy; Copyright EliteShop 2025. Tous droits réservés</p>
                </div>
            </footer></>
    );
}

