import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout-client";

// Use elegant fonts for a premium look
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-montserrat',
});

// Define metadata
export const metadata: Metadata = {
  title: {
    template: "%s | KnockoffKitchen",
    default: "KnockoffKitchen - Copycat Recipes for Your Favorite Foods",
  },
  description: "Make your favorite brand-name foods at home with our copycat recipes. Save money and enjoy healthier versions of popular snacks, treats, and meals.",
  keywords: ["copycat recipes", "homemade", "DIY food", "recipe clones", "knockoff recipes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayoutClient 
      playfairVariable={playfair.variable} 
      montserratVariable={montserrat.variable}
    >
      {children}
    </RootLayoutClient>
  );
}
