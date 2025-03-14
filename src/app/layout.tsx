import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Use Inter font instead of Geist for better compatibility with static exports
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-100 text-gray-900`}>
        <header className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">
              KnockoffKitchen
            </Link>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search recipes..."
                className="border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        
        <nav className="bg-gray-200 py-3">
          <div className="max-w-6xl mx-auto px-4 flex space-x-6 overflow-x-auto">
            <Link href="/" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Home
            </Link>
            <Link href="/category/chips" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Chips
            </Link>
            <Link href="/category/cookies" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Cookies
            </Link>
            <Link href="/category/sauces" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Sauces
            </Link>
            <Link href="/brand/pringles" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Pringles
            </Link>
            <Link href="/brand/doritos" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Doritos
            </Link>
            <Link href="/brand/lays" className="text-gray-700 hover:text-red-600 whitespace-nowrap">
              Lay's
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white text-center py-6 mt-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">KnockoffKitchen</h3>
                <p className="text-gray-300">Make your favorite brand-name foods at home</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link href="/category/chips" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
                <Link href="/brand/pringles" className="text-gray-300 hover:text-white">
                  Brands
                </Link>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p>© {new Date().getFullYear()} KnockoffKitchen. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
