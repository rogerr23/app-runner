import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Pista — Corra no seu ritmo",
    template: "%s — Pista",
  },
  description: "Planeje corridas, registre seus treinos e acompanhe sua evolução.",
  applicationName: "Pista",
  openGraph: {
    title: "Pista — Corra no seu ritmo",
    description: "Planeje corridas, registre seus treinos e acompanhe sua evolução.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/pista-social-v2.png", width: 1200, height: 630, alt: "Corredor avançando por uma pista em tons de ciano e violeta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pista — Corra no seu ritmo",
    description: "Planeje corridas, registre seus treinos e acompanhe sua evolução.",
    images: ["/pista-social-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
