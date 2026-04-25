import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollabChat - Sales Team Workspace",
  description: "Professional communication for high-stakes teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-background font-body-lg antialiased selection:bg-primary/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}
