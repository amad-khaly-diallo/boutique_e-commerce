'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './cgv.css';

export default function CGVPage() {
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
        <h1>Conditions Générales de Vente</h1>
        {formattedDate && (
          <p className="last-updated">Dernière mise à jour : {formattedDate}</p>
        )}

        <section>
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations entre EliteShop, société de vente 
            en ligne de produits de luxe, et tout client désireux d'effectuer un achat sur le site www.eliteshop.com.
          </p>
          <p>
            Toute commande implique l'acceptation sans réserve des présentes CGV.
          </p>
        </section>

        <section>
          <h2>2. Informations légales</h2>
          <p>
            <strong>Raison sociale :</strong> EliteShop<br />
            <strong>Adresse :</strong> 123 rue de la paix, France<br />
            <strong>Téléphone :</strong> +33 01 23 45 67 89<br />
            <strong>Email :</strong> <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a><br />
            <strong>Directeur de publication :</strong> EliteShop
          </p>
        </section>

        <section>
          <h2>3. Produits</h2>
          <h3>3.1. Description des produits</h3>
          <p>
            Les produits proposés à la vente sont ceux qui figurent sur le site au jour de la consultation par le client, 
            dans la limite des stocks disponibles. Les photographies et graphismes présentés ne sont pas contractuels 
            et ne sauraient engager la responsabilité d'EliteShop.
          </p>

          <h3>3.2. Disponibilité</h3>
          <p>
            EliteShop se réserve le droit de modifier l'assortiment de produits à tout moment. En cas d'indisponibilité 
            d'un produit après passation de commande, le client sera informé par email et pourra soit annuler sa commande 
            et obtenir un remboursement, soit reporter sa commande sur un produit équivalent.
          </p>

          <h3>3.3. Prix</h3>
          <p>
            Les prix de nos produits sont indiqués en euros TTC (toutes taxes comprises). Les prix sont valables tant qu'ils 
            sont visibles sur le site. EliteShop se réserve le droit de modifier ses prix à tout moment, étant toutefois 
            entendu que le prix figurant au jour de la commande sera le seul applicable à l'acheteur.
          </p>
        </section>

        <section>
          <h2>4. Commandes</h2>
          <h3>4.1. Processus de commande</h3>
          <p>
            Pour passer une commande, le client doit suivre le processus de commande en ligne et valider sa commande après 
            avoir vérifié le récapitulatif. La validation de la commande vaut acceptation des prix, des descriptions des 
            produits disponibles à la vente et des présentes CGV.
          </p>

          <h3>4.2. Confirmation de commande</h3>
          <p>
            Une confirmation de commande sera envoyée par email au client dès réception de sa commande. Cette confirmation 
            reprend les informations de la commande et les présentes CGV.
          </p>

          <h3>4.3. Annulation de commande</h3>
          <p>
            EliteShop se réserve le droit d'annuler toute commande d'un client avec lequel existerait un litige relatif 
            au paiement d'une commande antérieure.
          </p>
        </section>

        <section>
          <h2>5. Paiement</h2>
          <h3>5.1. Modalités de paiement</h3>
          <p>
            Le paiement s'effectue par carte bancaire (Visa, Mastercard, American Express) via notre prestataire de paiement sécurisé. 
            Le paiement est exigible immédiatement à la commande.
          </p>

          <h3>5.2. Sécurité des paiements</h3>
          <p>
            Les transactions sont sécurisées par cryptage SSL. Les données bancaires ne sont jamais stockées sur nos serveurs 
            et sont transmises directement à notre prestataire de paiement.
          </p>

          <h3>5.3. Refus de paiement</h3>
          <p>
            En cas de refus d'autorisation de paiement par les organismes bancaires, la commande sera automatiquement annulée.
          </p>
        </section>

        <section>
          <h2>6. Livraison</h2>
          <h3>6.1. Zones de livraison</h3>
          <p>
            EliteShop livre en France métropolitaine et dans les pays de l'Union Européenne. Les frais de livraison sont 
            indiqués lors de la validation de la commande.
          </p>

          <h3>6.2. Délais de livraison</h3>
          <p>
            Les délais de livraison sont indiqués à titre indicatif et commencent à courir à compter de la réception du paiement. 
            En cas de retard de livraison, le client sera informé par email. Si le retard excède 30 jours, le client peut 
            annuler sa commande et obtenir le remboursement de ses sommes versées.
          </p>

          <h3>6.3. Réception des produits</h3>
          <p>
            Le client doit vérifier l'état des produits à la réception. En cas de dommage ou de non-conformité, le client 
            doit formuler des réserves écrites dans un délai de 48 heures après réception.
          </p>
        </section>

        <section>
          <h2>7. Droit de rétractation</h2>
          <p>
            Conformément aux dispositions légales en vigueur, le client dispose d'un délai de 14 jours calendaires à compter 
            de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer 
            de pénalité.
          </p>
          <p>
            Pour exercer ce droit, le client doit notifier sa décision de se rétracter par email à : 
            <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a>
          </p>
          <p>
            Les produits doivent être retournés dans leur état d'origine, dans leur emballage d'origine, dans un délai de 14 jours 
            suivant la notification de rétractation. Les frais de retour sont à la charge du client, sauf si les produits livrés 
            ne correspondent pas à la commande.
          </p>
        </section>

        <section>
          <h2>8. Garanties</h2>
          <h3>8.1. Garantie légale de conformité</h3>
          <p>
            Conformément à la législation en vigueur, EliteShop est tenu de livrer des produits conformes au contrat et répond 
            des défauts de conformité existant lors de la délivrance.
          </p>

          <h3>8.2. Garantie des vices cachés</h3>
          <p>
            EliteShop garantit les produits contre les vices cachés conformément aux dispositions légales.
          </p>
        </section>

        <section>
          <h2>9. Responsabilité</h2>
          <p>
            La responsabilité d'EliteShop ne saurait être engagée en cas de dommages résultant de l'utilisation des produits 
            ou de l'impossibilité de les utiliser, notamment en cas de perte de profits ou de dommages indirects.
          </p>
        </section>

        <section>
          <h2>10. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments du site EliteShop (textes, images, vidéos, logos, etc.) sont la propriété exclusive d'EliteShop 
            et sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, même partielle, est interdite 
            sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2>11. Protection des données personnelles</h2>
          <p>
            Les données personnelles collectées lors de la commande sont nécessaires au traitement de celle-ci. Elles sont conservées 
            de manière sécurisée et ne sont en aucun cas transmises à des tiers à des fins commerciales. Pour plus d'informations, 
            consultez notre <Link href="/privacy">Politique de Confidentialité</Link>.
          </p>
        </section>

        <section>
          <h2>12. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige et à défaut d'accord amiable, le litige sera 
            porté devant les tribunaux français conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section>
          <h2>13. Contact</h2>
          <p>
            Pour toute question concernant ces conditions générales de vente, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par email : <a href="mailto:contact@eliteshop.com">contact@eliteshop.com</a></li>
            <li>Par téléphone : +33 01 23 45 67 89</li>
            <li>Par courrier : EliteShop, 123 rue de la paix, France</li>
          </ul>
        </section>

        <div className="legal-footer">
          <Link href="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  );
}

