"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Recipe {
  id: string;
  title: string;
  brandName: string;
  slug: string;
  imageUrl?: string;
}

interface BrandData {
  name: string;
  count: number;
  slug: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const recipesQuery = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        if (recipesSnapshot.empty) {
          setBrands([]);
          setLoading(false);
          return;
        }
        
        const recipesData = recipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        
        // Extract brands and count recipes for each brand
        const brandMap = new Map<string, BrandData>();
        
        recipesData.forEach(recipe => {
          const brandName = recipe.brandName || 'Unknown Brand';
          const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          
          if (brandMap.has(brandName)) {
            const brandData = brandMap.get(brandName)!;
            brandData.count++;
          } else {
            brandMap.set(brandName, {
              name: brandName,
              count: 1,
              slug: brandSlug
            });
          }
        });
        
        // Convert map to array and sort alphabetically
        const brandsArray = Array.from(brandMap.values()).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setBrands(brandsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchBrands();
  }, []);

  // Function to get a gradient based on brand name
  const getBrandGradient = (brandName: string): string => {
    // Create a simple hash of the brand name to get consistent colors
    const hash = brandName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Map of brand names to specific gradients for common brands
    const gradientMap: Record<string, string> = {
      'Pringles': 'linear-gradient(135deg, #D50000 0%, #FF6D00 100%)',
      'Doritos': 'linear-gradient(135deg, #FF3D00 0%, #FFAB00 100%)',
      'Lay\'s': 'linear-gradient(135deg, #FFD600 0%, #FF6D00 100%)',
      'Oreo': 'linear-gradient(135deg, #212121 0%, #616161 100%)',
      'Coca-Cola': 'linear-gradient(135deg, #D50000 0%, #FF1744 100%)',
      'Pepsi': 'linear-gradient(135deg, #0D47A1 0%, #2196F3 100%)',
      'McDonald\'s': 'linear-gradient(135deg, #FF6F00 0%, #FFAB00 100%)',
      'KFC': 'linear-gradient(135deg, #D50000 0%, #FF1744 100%)',
    };
    
    // Return mapped gradient if exists, otherwise generate one based on hash
    if (gradientMap[brandName]) {
      return gradientMap[brandName];
    }
    
    // Generate a gradient based on the hash
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360; // Offset for second color
    
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%) 0%, hsl(${hue2}, 80%, 60%) 100%)`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 font-serif text-center">Brands</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No brands found.</p>
          <Link 
            href="/recipes"
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            View all recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map(brand => (
            <Link 
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    background: getBrandGradient(brand.name),
                  }}
                >
                  <div className="text-4xl mb-3 text-white">
                    <i className="fas fa-trademark"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{brand.name}</h2>
                  <p className="text-white text-sm">{brand.count} {brand.count === 1 ? 'Recipe' : 'Recipes'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center">
        <Link 
          href="/"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
