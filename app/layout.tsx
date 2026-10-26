import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Frank Binette",
  description: "Frank Binette is an all around data dude... etc.",
  keywords: [
    "Frank", "Francois", "Vienneau", "Binette", "Montreal", "Quebec", "Canada",
    "big data", "data science", "machine learning", "data visualization",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
