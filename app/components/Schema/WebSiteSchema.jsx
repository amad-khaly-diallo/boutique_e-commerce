/**
 * Schema.org pour le site web avec fonctionnalité de recherche
 * À utiliser dans le layout principal
 */
"use client";
export default function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EliteShop",
    "url": baseUrl,
    "description": "Boutique de luxe spécialisée dans les montres, sacs et bijoux haut de gamme",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EliteShop",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/lux.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

