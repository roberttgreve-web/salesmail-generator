import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Mail-Generator | DEIN ERSTER TAG",
  description: "Sales-Tool zur Erstellung personalisierter Angebots-E-Mails",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
