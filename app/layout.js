
import "./globals.css";
import Header  from "./components/Header/page";
import Footer  from "./components/Footer/page";
import { ToastProvider } from "./contexts/ToastContext";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import SchemaInjector from "./components/Schema/SchemaInjector";



export const metadata = {
  title: {
    default: "EliteShop - Boutique de Luxe | Montres, Sacs & Bijoux",
    template: "%s | EliteShop"
  },
  description: "Découvrez notre collection exclusive de montres de luxe, sacs haut de gamme et bijoux précieux. EliteShop vous propose les plus grandes marques : Rolex, Omega, Patek Philippe, Hermès, Louis Vuitton, Cartier et bien plus encore.",
  keywords: ["luxe", "montres", "sacs", "bijoux", "Rolex", "Omega", "Patek Philippe", "Hermès", "Louis Vuitton", "Cartier", "boutique en ligne", "e-commerce"],
  authors: [{ name: "EliteShop" }],
  creator: "EliteShop",
  publisher: "EliteShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "EliteShop",
    title: "EliteShop - Boutique de Luxe | Montres, Sacs & Bijoux",
    description: "Découvrez notre collection exclusive de montres de luxe, sacs haut de gamme et bijoux précieux.",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "EliteShop - Boutique de Luxe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteShop - Boutique de Luxe",
    description: "Découvrez notre collection exclusive de montres de luxe, sacs haut de gamme et bijoux précieux.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Ajoutez vos codes de vérification ici si nécessaire
    // google: "votre-code-google",
    // yandex: "votre-code-yandex",
    // bing: "votre-code-bing",
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  // Schéma Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EliteShop",
    "url": baseUrl,
    "logo": `${baseUrl}/images/lux.png`,
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
    "sameAs": []
  };

  // Schéma WebSite
  const websiteSchema = {
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
    <html lang="fr" suppressHydrationWarning>
      <body  suppressHydrationWarning>
        <SchemaInjector schemas={[organizationSchema, websiteSchema]} />
        <ToastProvider>
          <UserProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
