import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "CENIT — Ropa que se queda", template: "%s · CENIT" },
  description:
    "CENIT — moda contemporánea hecha para durar. Camisas, punto, sastrería suave y abrigos.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "CENIT",
    title: "CENIT — Ropa que se queda",
    description: "Moda contemporánea hecha para durar.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "CENIT", description: "Ropa que se queda." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ECEAE2",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Schibsted+Grotesk:wght@400;500;600;700&family=Fragment+Mono:ital@0;1&display=swap"
        />
      </head>
      <body>
        <Providers>
          <a className="skip" href="#main">
            Saltar al contenido
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
