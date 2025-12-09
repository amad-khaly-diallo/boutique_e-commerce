'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './mentions-legales.css';

export default function MentionsLegalesPage() {
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
        <h1>Mentions Légales</h1>
        {formattedDate && (
          <p className="last-updated">Dernière mise à jour : {formattedDate}</p>
        )}

        <section>
          <h2>1. Informations sur l'entreprise</h2>
          <p>
            <strong>Raison sociale :</strong> EliteShop<br />
            <strong>Forme juridique :</strong> Société à responsabilité limitée (SARL)<br />
            <strong>Capital social :</strong> 10 000 €<br />
            <strong>Siège social :</strong> 123 rue de la paix, France<br />
            <strong>SIRET :</strong> 123 456 789 00012<br />
            <strong>RCS :</strong> Paris B 123 456 789<br />
            <strong>Numéro TVA intracommunautaire :</strong> FR 12 123456789
          </p>
        </section>

        <section>
          <h2>2. Contact</h2>
          <p>
            <strong>Téléphone :</strong> <a href="tel:+330123456789">+33 01 23 45 67 89</a><br />
            <strong>Email :</strong> <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a><br />
            <strong>Adresse postale :</strong> EliteShop, 123 rue de la paix, France
          </p>
        </section>

        <section>
          <h2>3. Directeur de publication</h2>
          <p>
            <strong>Nom :</strong> EliteShop<br />
            <strong>Fonction :</strong> Directeur de publication<br />
            <strong>Contact :</strong> <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a>
          </p>
        </section>

        <section>
          <h2>4. Hébergement</h2>
          <p>
            Le site www.eliteshop.com est hébergé par :<br />
            <strong>Nom de l'hébergeur :</strong> EliteShop<br />
            <strong>Adresse :</strong> 123 rue de la paix <br />
            <strong>Téléphone :</strong> +33 01 23 45 67 89
          </p>
        </section>

        <section>
          <h2>5. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété 
            intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les 
            représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique ou autre est formellement interdite sauf 
            autorisation expresse du directeur de la publication.
          </p>
        </section>

        <section>
          <h2>6. Protection des données personnelles</h2>
          <p>
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection 
            des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données 
            personnelles vous concernant.
          </p>
          <p>
            Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : 
            <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a>
          </p>
          <p>
            Pour plus d'informations, consultez notre <Link href="/privacy">Politique de Confidentialité</Link>.
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer 
            sur le site, vous acceptez l'utilisation de cookies. Vous pouvez désactiver les cookies dans les paramètres de votre 
            navigateur, mais cela peut affecter certaines fonctionnalités du site.
          </p>
        </section>

        <section>
          <h2>8. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. Les liens vers ces 
            autres ressources vous font quitter le site EliteShop.
          </p>
          <p>
            Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse de l'éditeur. 
            Aucune autorisation ni demande d'information préalable ne peut être exigée par l'éditeur à l'égard d'un site qui 
            souhaite établir un lien vers le site de l'éditeur. Il convient toutefois d'afficher ce site dans une nouvelle fenêtre 
            du navigateur.
          </p>
        </section>

        <section>
          <h2>9. Limitation de responsabilité</h2>
          <p>
            Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
            mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
          </p>
          <p>
            EliteShop ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, 
            lors de l'accès au site EliteShop, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications 
            indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
          </p>
        </section>

        <section>
          <h2>10. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, 
            le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section>
          <h2>11. Médiation</h2>
          <p>
            Conformément aux articles L.611-1 et R.612-1 et suivants du Code de la consommation concernant le règlement amiable 
            des litiges, EliteShop adhère au service du médiateur suivant : [Nom du médiateur]
          </p>
          <p>
            Le consommateur peut introduire une réclamation auprès de ce médiateur aux coordonnées suivantes :<br />
            [Coordonnées du médiateur]
          </p>
        </section>

        <div className="legal-footer">
          <Link href="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  );
}

