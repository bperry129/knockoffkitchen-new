import '../app/globals.css';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import Head from 'next/head';

// Use Montserrat font for a more premium look
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Custom styles for gradients and premium look
const styles = {
  gradientBg: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  headerGradient: {
    background: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)',
    boxShadow: '0 4px 20px rgba(255, 65, 108, 0.2)',
  },
  navGradient: {
    background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
    boxShadow: '0 4px 15px rgba(71, 118, 230, 0.2)',
  },
  footerGradient: {
    background: 'linear-gradient(90deg, #141e30 0%, #243b55 100%)',
  },
  searchBox: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  navLink: {
    transition: 'all 0.3s ease',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  navLinkHover: {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
};

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${montserrat.className} antialiased min-h-screen`} style={styles.gradientBg}>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      
      <header style={styles.headerGradient} className="py-4 text-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <i className="fas fa-utensils"></i>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
              KnockoffKitchen
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
                className="pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                style={styles.searchBox}
              />
              <i className="fas fa-search absolute left-3 top-3 text-white"></i>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition duration-300">
              <i className="fas fa-bell text-white"></i>
            </button>
          </div>
          <button className="md:hidden bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition duration-300">
            <i className="fas fa-bars text-white"></i>
          </button>
        </div>
      </header>
      
      <nav style={styles.navGradient} className="py-3 text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex space-x-2 overflow-x-auto">
          <Link 
            href="/" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <Link 
            href="/category/chips" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-cookie-bite"></i>
            <span>Chips</span>
          </Link>
          <Link 
            href="/category/cookies" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-cookie"></i>
            <span>Cookies</span>
          </Link>
          <Link 
            href="/category/sauces" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-wine-bottle"></i>
            <span>Sauces</span>
          </Link>
          <Link 
            href="/brand/pringles" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-trademark"></i>
            <span>Pringles</span>
          </Link>
          <Link 
            href="/brand/doritos" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-trademark"></i>
            <span>Doritos</span>
          </Link>
          <Link 
            href="/brand/lays" 
            className="text-white whitespace-nowrap hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            style={styles.navLink}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <i className="fas fa-trademark"></i>
            <span>Lay's</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>

      <footer style={styles.footerGradient} className="text-white py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <i className="fas fa-utensils text-2xl"></i>
                <h3 className="text-2xl font-bold">KnockoffKitchen</h3>
              </div>
              <p className="text-gray-300 max-w-md">Make your favorite brand-name foods at home with our premium copycat recipes.</p>
              <div className="flex gap-4 mt-4 justify-center md:justify-start">
                <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition duration-300">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center md:text-left">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-chevron-right text-xs"></i>
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/chips" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-chevron-right text-xs"></i>
                      <span>Categories</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/brand/pringles" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2 justify-center md:justify-start">
                      <i className="fas fa-chevron-right text-xs"></i>
                      <span>Brands</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2">
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
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>© {new Date().getFullYear()} KnockoffKitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
