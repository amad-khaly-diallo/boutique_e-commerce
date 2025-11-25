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
                            <li><a href="#">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</a></li>
                            <li><a href="tel:+8801688888899">+330693191813</a></li>
                            <li><a href="mailto:exclusive@gmail.com">ahmed.Support@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>conte   </h3>
                        <ul>
                            <li><a href="#">Mon conte </a></li>
                            <li><a href="#">connetion  / enregistrement </a></li>
                            <li><a href="#">Cart</a></li>
                            <li><a href="#">Liste de souhaits</a></li>
                            <li><a href="#">Shop</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Lien rapide</h3>
                        <ul>
                            <li><a href="#">politique de confidentialité</a></li>
                            <li><a href="#">Conditions d'utilisation</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Télécharger l'application</h3>
                        <p>Économisez 3 $ avec l'application pour les nouveaux utilisateurs uniquement</p>
                        <div className="qr-code">QR</div>
                        <div className="app-links">
                            <button>Google Play</button>
                            <button>App Store</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© Copyright Exclusive 2024. Tous droits réservés</p>
                </div>
            </footer></>
    );
}

