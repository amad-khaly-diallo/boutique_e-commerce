import { Metadata } from 'next';
import Link from 'next/link';
import './terms.css';

export const metadata = {
  title: 'Conditions d\'Utilisation',
  description: 'Conditions d\'utilisation d\'EliteShop - Lisez nos conditions générales d\'utilisation avant d\'utiliser notre site.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Conditions d'Utilisation</h1>
        <p className="last-updated">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant le site EliteShop, vous acceptez d'être lié par ces conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
          </p>
        </section>

        <section>
          <h2>2. Utilisation du site</h2>
          <h3>2.1. Utilisation autorisée</h3>
          <p>Vous êtes autorisé à :</p>
          <ul>
            <li>Naviguer et consulter les produits disponibles</li>
            <li>Effectuer des achats sur notre site</li>
            <li>Créer un compte utilisateur</li>
            <li>Partager du contenu via les fonctionnalités sociales du site</li>
          </ul>

          <h3>2.2. Utilisation interdite</h3>
          <p>Il est strictement interdit de :</p>
          <ul>
            <li>Utiliser le site à des fins illégales ou frauduleuses</li>
            <li>Tenter d'accéder à des zones restreintes du site</li>
            <li>Transmettre des virus, malwares ou codes malveillants</li>
            <li>Copier, reproduire ou revendre le contenu du site sans autorisation</li>
            <li>Utiliser des robots, scripts automatisés ou méthodes similaires</li>
            <li>Harceler, menacer ou nuire à d'autres utilisateurs</li>
          </ul>
        </section>

        <section>
          <h2>3. Compte utilisateur</h2>
          <h3>3.1. Création de compte</h3>
          <p>
            Pour effectuer des achats, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité 
            de vos identifiants et de toutes les activités qui se produisent sous votre compte.
          </p>

          <h3>3.2. Informations exactes</h3>
          <p>
            Vous vous engagez à fournir des informations exactes, à jour et complètes lors de la création de votre compte 
            et lors de vos commandes.
          </p>
        </section>

        <section>
          <h2>4. Commandes et paiements</h2>
          <h3>4.1. Passation de commande</h3>
          <p>
            En passant une commande, vous faites une offre d'achat que nous pouvons accepter ou refuser. 
            Nous nous réservons le droit de refuser toute commande pour quelque raison que ce soit.
          </p>

          <h3>4.2. Prix</h3>
          <p>
            Tous les prix sont indiqués en euros (€) TTC. Nous nous réservons le droit de modifier les prix à tout moment, 
            mais les prix applicables sont ceux en vigueur au moment de la commande.
          </p>

          <h3>4.3. Paiement</h3>
          <p>
            Le paiement est effectué de manière sécurisée via nos prestataires de paiement. 
            Nous acceptons les cartes bancaires principales et autres méthodes de paiement proposées.
          </p>
        </section>

        <section>
          <h2>5. Livraison</h2>
          <p>
            Les délais de livraison sont indicatifs et peuvent varier. Nous ne sommes pas responsables des retards 
            causés par les transporteurs ou des événements indépendants de notre volonté.
          </p>
        </section>

        <section>
          <h2>6. Droit de rétractation</h2>
          <p>
            Conformément à la législation française, vous disposez d'un délai de 14 jours à compter de la réception 
            de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalité.
          </p>
          <p>
            Pour exercer ce droit, contactez-nous à : <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a>
          </p>
        </section>

        <section>
          <h2>7. Propriété intellectuelle</h2>
          <p>
            Tout le contenu du site (textes, images, logos, design, etc.) est la propriété d'EliteShop ou de ses partenaires 
            et est protégé par les lois sur la propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </p>
        </section>

        <section>
          <h2>8. Limitation de responsabilité</h2>
          <p>
            EliteShop ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de 
            l'impossibilité d'utiliser le site, sauf en cas de faute lourde ou de dol de notre part.
          </p>
        </section>

        <section>
          <h2>9. Modification des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. 
            Les modifications entrent en vigueur dès leur publication sur le site.
          </p>
        </section>

        <section>
          <h2>10. Droit applicable et juridiction</h2>
          <p>
            Ces conditions d'utilisation sont régies par le droit français. 
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, contactez-nous :
          </p>
          <ul>
            <li>Email : <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a></li>
            <li>Adresse : EliteShop, 123 rue de la paix, France</li>
          </ul>
        </section>

        <div className="legal-footer">
          <Link href="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  );
}

