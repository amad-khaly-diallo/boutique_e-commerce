import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header  from "./components/Header/page";
import Footer  from "./components/Footer/page";
import { ToastProvider } from "./contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        url: "/images/lux.png",
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
    images: ["/images/lux.png"],
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <ToastProvider>
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
