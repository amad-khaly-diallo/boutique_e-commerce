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
                            <li><a href="#">11 rue des sale arabe </a></li>
                            <li><a href="tel:+8801688888899">+33 06 mais couille noir sa mere</a></li>
                            <li><a href="mailto:exclusive@gmail.com">nadir.souifi@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>compte  </h3>
                        <ul>
                            <li><a href="/account">Mon compte </a></li>
                            <li><a href="/login">connexion / enregistrement </a></li>
                            <li><a href="/cart">Cart</a></li>
                            <li><a href="whislist">Liste de souhaits</a></li>
                            <li><a href="/checkout">Shop</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Lien rapide</h3>
                        <ul>
                            <li><a href="#">politique de confidentialité</a></li>
                            <li><a href="#">Conditions d'utilisation</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© Copyright Exclusive 2024. Tous droits réservés</p>
                </div>
            </footer></>
    );
}

