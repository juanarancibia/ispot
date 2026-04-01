import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ISPOT IMPORT — Equipamiento Premium",
  description:
    "Importación de equipos premium. Cámaras, lentes, MacBooks, iPhones y drones al mejor precio. Stock garantizado, comprá por WhatsApp.",
  keywords: ["ispot", "tecnología", "cámaras", "macbooks", "iphone", "importados", "precios", "córdoba"],
  openGraph: {
    title: "ISPOT IMPORT",
    description: "Equipamiento original de fábrica. Catálogo actualizado diariamente.",
    type: "website",
  },
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ispot-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
