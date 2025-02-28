import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "LC Dashboard",
  description: "NEXT.JS application to fetch and display LeetCode problems",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
