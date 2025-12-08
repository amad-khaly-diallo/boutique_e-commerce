/**
 * Schema.org pour un produit
 * @param {Object} product - Données du produit
 */
"use client";
export default function ProductSchema({ product }) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${baseUrl}/products/${product.product_id}`;
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
    : `${baseUrl}/images/lux.png`;

  // Déterminer la catégorie Schema.org
  let category = "Product";
  if (product.category === "Montre") {
    category = "Watch";
  } else if (product.category === "Sac") {
    category = "Product"; // Pas de catégorie spécifique pour les sacs
  } else if (product.category === "Bijoux") {
    category = "Product"; // Pas de catégorie spécifique pour les bijoux
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": category,
    "name": product.product_name,
    "description": product.description || product.product_name,
    "image": imageUrl,
    "sku": `PROD-${product.product_id}`,
    "brand": {
      "@type": "Brand",
      "name": "EliteShop"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "EUR",
      "price": parseFloat(product.price) || 0,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 an
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "EliteShop"
      }
    },
    "aggregateRating": product.note ? {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(product.note) || 0,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": 1 // À remplacer par le nombre réel d'avis si disponible
    } : undefined
  };

  // Supprimer aggregateRating si undefined
  if (!schema.aggregateRating) {
    delete schema.aggregateRating;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

