import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Barlow_Condensed, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naked Fest Winter'27",
  description: "La libération par le froid & le son — festival hivernal extrême",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "N'FEST",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Naked Fest Winter'27",
    title: "Naked Fest Winter'27",
    description: "La libération par le froid & le son — festival hivernal extrême",
    images: [
      {
        url: "/necked_fest_homepage_1.jpg",
        width: 1200,
        height: 630,
        alt: "Naked Fest Winter'27 — Fatal Fields, Ardennes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naked Fest Winter'27",
    description: "La libération par le froid & le son — festival hivernal extrême",
    images: ["/necked_fest_homepage_1.jpg"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__pwaPrompt = window.__pwaPrompt || null;
              window.addEventListener('beforeinstallprompt', function (e) {
                e.preventDefault();
                window.__pwaPrompt = e;
                window.dispatchEvent(new Event('pwa-installable'));
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-dark text-white">
        {children}
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
