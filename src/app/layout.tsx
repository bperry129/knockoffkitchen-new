import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Use Inter font instead of Geist for better compatibility with static exports
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Add inline styles to ensure basic styling works even if CSS files fail to load
const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    fontFamily: "Inter, system-ui, sans-serif",
    margin: 0,
    padding: 0,
  },
  header: {
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1rem 0",
  },
  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#dc2626",
    textDecoration: "none",
  },
  nav: {
    backgroundColor: "#e5e7eb",
    padding: "0.75rem 0",
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    overflowX: "auto",
  },
  navLink: {
    color: "#374151",
    textDecoration: "none",
    marginRight: "1.5rem",
    whiteSpace: "nowrap",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  footer: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    textAlign: "center",
    padding: "1.5rem 0",
    marginTop: "2.5rem",
  },
  footerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
};

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
      <body className={`${inter.className}`} style={styles.body}>
        {/* Use both Tailwind classes and inline styles as fallback */}
        <header className="bg-white shadow-md" style={styles.header}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center" style={styles.headerInner}>
            <Link href="/" className="text-2xl font-bold text-red-600" style={styles.logo}>
              KnockoffKitchen
            </Link>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search recipes..."
                className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none"
                style={{ border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.5rem 1rem', width: '16rem' }}
              />
            </div>
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        
        <nav className="bg-gray-200 py-3" style={styles.nav}>
          <div className="max-w-6xl mx-auto px-4 flex space-x-6 overflow-x-auto" style={styles.navInner}>
            <Link href="/" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Home
            </Link>
            <Link href="/category/chips" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Chips
            </Link>
            <Link href="/category/cookies" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Cookies
            </Link>
            <Link href="/category/sauces" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Sauces
            </Link>
            <Link href="/brand/pringles" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Pringles
            </Link>
            <Link href="/brand/doritos" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Doritos
            </Link>
            <Link href="/brand/lays" className="text-gray-700 hover:text-red-600 whitespace-nowrap" style={styles.navLink}>
              Lay's
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8" style={styles.main}>
          {children}
        </main>

        <footer className="bg-gray-800 text-white text-center py-6 mt-10" style={styles.footer}>
          <div className="max-w-6xl mx-auto px-4" style={styles.footerInner}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>KnockoffKitchen</h3>
                <p style={{ color: '#d1d5db' }}>Make your favorite brand-name foods at home</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link href="/" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                  Home
                </Link>
                <Link href="/category/chips" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                  Categories
                </Link>
                <Link href="/brand/pringles" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                  Brands
                </Link>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #4b5563' }}>
              <p>© {new Date().getFullYear()} KnockoffKitchen. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
