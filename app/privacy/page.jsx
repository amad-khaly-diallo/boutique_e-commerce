'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './privacy.css';

export default function PrivacyPage() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Formater la date uniquement côté client pour éviter les problèmes d'hydration
    setFormattedDate(
      new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    );
  }, []);

  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Politique de Confidentialité</h1>
        {formattedDate && (
          <p className="last-updated">Dernière mise à jour : {formattedDate}</p>
        )}

        <section>
          <h2>1. Introduction</h2>
          <p>
            EliteShop ("nous", "notre", "nos") s'engage à protéger la confidentialité de vos informations personnelles. 
            Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons 
            vos données lorsque vous utilisez notre site web et nos services.
          </p>
        </section>

        <section>
          <h2>2. Données que nous collectons</h2>
          <h3>2.1. Informations que vous nous fournissez</h3>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Adresse postale (pour la livraison)</li>
            <li>Numéro de téléphone</li>
            <li>Informations de paiement (traitées de manière sécurisée par nos prestataires de paiement)</li>
          </ul>

          <h3>2.2. Informations collectées automatiquement</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type de navigateur et système d'exploitation</li>
            <li>Pages visitées et temps passé sur le site</li>
            <li>Cookies et technologies similaires</li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation de vos données</h2>
          <p>Nous utilisons vos données personnelles pour :</p>
          <ul>
            <li>Traiter et gérer vos commandes</li>
            <li>Vous fournir un service client de qualité</li>
            <li>Vous envoyer des communications relatives à vos commandes</li>
            <li>Améliorer notre site web et nos services</li>
            <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h2>4. Partage de vos données</h2>
          <p>
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
          </p>
          <ul>
            <li><strong>Prestataires de services</strong> : services de paiement, transporteurs, services d'emailing</li>
            <li><strong>Autorités légales</strong> : si requis par la loi ou pour protéger nos droits</li>
            <li><strong>Partenaires commerciaux</strong> : uniquement avec votre consentement explicite</li>
          </ul>
        </section>

        <section>
          <h2>5. Sécurité de vos données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
            vos données personnelles contre l'accès non autorisé, la perte, la destruction ou la modification. 
            Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.
          </p>
        </section>

        <section>
          <h2>6. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : vous pouvez demander une copie de vos données personnelles</li>
            <li><strong>Droit de rectification</strong> : vous pouvez corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : vous pouvez récupérer vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement</strong> : à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a>
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience. Les cookies sont de petits fichiers texte 
            stockés sur votre appareil. Vous pouvez contrôler et gérer les cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2>8. Conservation des données</h2>
          <p>
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour les finalités décrites dans 
            cette politique, ou conformément aux obligations légales applicables.
          </p>
        </section>

        <section>
          <h2>9. Modifications de cette politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité de temps à autre. Toute modification sera publiée 
            sur cette page avec une date de mise à jour révisée.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité, contactez-nous :
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

