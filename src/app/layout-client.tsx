"use client";

import Link from "next/link";
import React from "react";
import SearchAutocomplete from "./components/SearchAutocomplete";

// Custom styles for elegant and premium look
const styles = {
  gradientBg: {
    background: '#f8f9fa',
  },
  headerStyle: {
    background: '#1a1a2e',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  navStyle: {
    background: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  footerStyle: {
    background: '#1a1a2e',
  },
  searchBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  navLink: {
    transition: 'all 0.3s ease',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a4a68',
    fontWeight: 500,
  },
  navLinkHover: {
    color: '#e63946',
    transform: 'translateY(-2px)',
  },
};

export default function RootLayoutClient({
  children,
  playfairVariable,
  montserratVariable,
}: {
  children: React.ReactNode;
  playfairVariable: string;
  montserratVariable: string;
}) {
  const currentYear = new Date().getFullYear();
  
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`${playfairVariable} ${montserratVariable} font-sans antialiased min-h-screen`} style={styles.gradientBg}>
        <header style={styles.headerStyle} className="py-5 text-white">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-serif tracking-tight flex items-center gap-2">
              <i className="fas fa-utensils text-white"></i>
              <span className="font-bold">
                KnockoffKitchen
              </span>
            </Link>
            <div className="hidden md:flex items-center">
              <SearchAutocomplete />
            </div>
            <button className="md:hidden bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full transition duration-300">
              <i className="fas fa-bars text-white"></i>
            </button>
          </div>
        </header>
        
        <nav style={styles.navStyle} className="py-3 sticky top-0 z-10 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 flex space-x-2 overflow-x-auto">
            <Link 
              href="/" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link 
              href="/recipes" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-book-open"></i>
              <span>Recipes</span>
            </Link>
            <Link 
              href="/categories" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-tags"></i>
              <span>Categories</span>
            </Link>
            <Link 
              href="/brands" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-trademark"></i>
              <span>Brands</span>
            </Link>
            <Link 
              href="/about" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </Link>
            <Link 
              href="/contact" 
              className="whitespace-nowrap transition-all duration-300"
              style={styles.navLink}
            >
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer style={styles.footerStyle} className="text-white py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <i className="fas fa-utensils text-2xl"></i>
                  <h3 className="text-2xl font-serif font-bold">KnockoffKitchen</h3>
                </div>
                <p className="text-gray-300 max-w-md">Make your favorite brand-name foods at home with our premium copycat recipes.</p>
                {/* Social media icons removed */}
              </div>
              <div className="grid grid-cols-2 gap-12 text-center md:text-left">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/recipes" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span>Recipes</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/categories" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span>Categories</span>
                      </Link>
                    </li>
                    <li>
                    <Link href="/brands" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-chevron-right text-xs"></i>
                      <span>Brands</span>
                    </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-envelope"></i>
                      <span>info@knockoffkitchen.com</span>
                    </li>
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-phone"></i>
                      <span>(123) 456-7890</span>
                    </li>
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>New York, NY</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              <p className="mb-2">© {currentYear} KnockoffKitchen. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <Link href="/about" className="hover:text-white transition duration-300">About</Link>
                <Link href="/contact" className="hover:text-white transition duration-300">Contact</Link>
                <Link href="/terms" className="hover:text-white transition duration-300">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-white transition duration-300">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
