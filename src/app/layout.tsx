import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  KnockoffKitchen
                </Link>
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="hidden md:flex space-x-8 mt-4 md:mt-0">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/category/chips" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Categories
                </Link>
                <Link href="/brand/pringles" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Brands
                </Link>
                <Link href="/recipes/pringles-bbq-chips-copycat" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Featured Recipe
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
