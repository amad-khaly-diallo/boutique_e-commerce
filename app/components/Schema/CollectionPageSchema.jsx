/**
 * Schema.org pour une page de collection (liste de produits)
 * @param {Object} props - {title, description, products, url}
 */
"use client";
export default function CollectionPageSchema({ title, description, products = [], url }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pageUrl = url || baseUrl;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": pageUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.product_name,
          "url": `${baseUrl}/products/${product.product_id}`,
          "image": product.image 
            ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
            : `${baseUrl}/images/lux.png`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": parseFloat(product.price) || 0,
            "availability": product.stock > 0 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock"
          }
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

