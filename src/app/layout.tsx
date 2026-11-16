import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Little Universe — For Manvi",
  description: "Nine years of little moments, big memories, and a story that keeps growing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
