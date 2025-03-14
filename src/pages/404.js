import Link from 'next/link';
import { useState } from 'react';

// Custom styles for elegant and premium look
const styles = {
  errorSection: {
    background: '#1a1a2e',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  accentButton: {
    background: '#e63946',
    color: 'white',
    boxShadow: '0 4px 15px rgba(230, 57, 70, 0.2)',
    transition: 'all 0.3s ease',
    borderRadius: '0.25rem',
  },
  accentButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(230, 57, 70, 0.3)',
  },
};

export default function Custom404() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 text-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full transform translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100 to-red-100 rounded-full transform -translate-x-1/3 translate-y-1/3 z-0"></div>
      
      <div className="relative z-10 text-center px-4 max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 rounded-full bg-red-100 mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
          </div>
          <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The recipe you're looking for seems to have vanished from our kitchen.
          </p>
        </div>
        
        <div className="space-y-6">
          <div style={styles.errorSection} className="p-6 text-white text-left rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <i className="fas fa-lightbulb mr-2"></i>
              <span>Try one of these instead:</span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-chevron-right mr-2 text-sm"></i>
                <Link href="/" className="hover:underline">Browse our home page</Link>
              </li>
              <li className="flex items-center">
                <i className="fas fa-chevron-right mr-2 text-sm"></i>
                <Link href="/category/chips" className="hover:underline">Check out our chip recipes</Link>
              </li>
              <li className="flex items-center">
                <i className="fas fa-chevron-right mr-2 text-sm"></i>
                <Link href="/category/cookies" className="hover:underline">Explore cookie recipes</Link>
              </li>
            </ul>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 text-white rounded-full font-medium"
            style={{
              ...styles.accentButton,
              ...(isButtonHovered ? styles.accentButtonHover : {})
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <i className="fas fa-home mr-2"></i>
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
