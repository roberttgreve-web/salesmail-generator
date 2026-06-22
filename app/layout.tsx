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
      <body>{children}</body>
    </html>
  );
}
