import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LC Dashboard",
  description: "NEXT.JS application to fetch and display LeetCode problems",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen w-full">
        <main className="container mx-auto px-2 sm:px-4 md:px-6 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
