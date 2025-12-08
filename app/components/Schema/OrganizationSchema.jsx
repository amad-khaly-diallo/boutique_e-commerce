/**
 * Schema.org pour l'organisation (EliteShop)
 * À utiliser dans le layout principal
 */
"use client";
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EliteShop",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/lux.png`,
    "description": "Boutique de luxe spécialisée dans les montres, sacs et bijoux haut de gamme",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-01-23-45-67-89",
      "contactType": "Service client",
      "email": "contact@eliteshop.com",
      "areaServed": "FR",
      "availableLanguage": ["French"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 rue de la paix",
      "addressCountry": "FR",
      "addressLocality": "France"
    },
    "sameAs": [
      // Ajoutez vos réseaux sociaux ici si vous en avez
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

