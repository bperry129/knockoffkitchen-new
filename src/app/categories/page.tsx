"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Function to get a gradient based on category name
const getCategoryGradient = (categoryName: string): string => {
  // Create a simple hash of the category name to get consistent colors
  const hash = categoryName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Map of category names to specific gradients for common categories
  const gradientMap: Record<string, string> = {
    'Chips': 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)',
    'Sauces': 'linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)',
    'Spreads': 'linear-gradient(135deg, #F09819 0%, #EDDE5D 100%)',
    'Snacks': 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)',
    'Cookies': 'linear-gradient(135deg, #C33764 0%, #1D2671 100%)',
    'Desserts': 'linear-gradient(135deg, #4568DC 0%, #B06AB3 100%)',
    'Drinks': 'linear-gradient(135deg, #3494E6 0%, #EC6EAD 100%)',
    'Breakfast': 'linear-gradient(135deg, #FDFC47 0%, #24FE41 100%)',
    'Dinner': 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    'Lunch': 'linear-gradient(135deg, #1E9600 0%, #FFF200 100%)',
  };
  
  // Return mapped gradient if exists, otherwise generate one based on hash
  if (gradientMap[categoryName]) {
    return gradientMap[categoryName];
  }
  
  // Generate a gradient based on the hash
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40) % 360; // Offset for second color
  
  return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%) 0%, hsl(${hue2}, 80%, 60%) 100%)`;
};

// Function to get an icon based on category name
const getCategoryIcon = (categoryName: string): JSX.Element => {
  // Map of category names to Font Awesome icons
  const iconMap: Record<string, JSX.Element> = {
    'Chips': <i className="fas fa-cookie-bite"></i>,
    'Sauces': <i className="fas fa-wine-bottle"></i>,
    'Spreads': <i className="fas fa-mortar-pestle"></i>,
    'Snacks': <i className="fas fa-cheese"></i>,
    'Cookies': <i className="fas fa-cookie"></i>,
    'Desserts': <i className="fas fa-ice-cream"></i>,
    'Drinks': <i className="fas fa-glass-martini-alt"></i>,
    'Breakfast': <i className="fas fa-egg"></i>,
    'Dinner': <i className="fas fa-utensils"></i>,
    'Lunch': <i className="fas fa-hamburger"></i>,
  };
  
  // Return mapped icon if exists, otherwise use a default icon
  return iconMap[categoryName] || <i className="fas fa-utensils"></i>;
};

interface Recipe {
  id: string;
  title: string;
  category: string;
  slug: string;
  imageUrl?: string;
}

interface CategoryData {
  name: string;
  count: number;
  imageUrl?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const recipesQuery = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        if (recipesSnapshot.empty) {
          setCategories([]);
          setLoading(false);
          return;
        }
        
        const recipesData = recipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        
        // Extract categories and count recipes in each category
        const categoryMap = new Map<string, CategoryData>();
        
        recipesData.forEach(recipe => {
          const category = recipe.category || 'Uncategorized';
          
          if (categoryMap.has(category)) {
            const categoryData = categoryMap.get(category)!;
            categoryData.count++;
            
            // Only update image if not already set
            if (!categoryData.imageUrl && recipe.imageUrl) {
              categoryData.imageUrl = recipe.imageUrl;
            }
          } else {
            categoryMap.set(category, {
              name: category,
              count: 1,
              imageUrl: recipe.imageUrl
            });
          }
        });
        
        // Convert map to array and sort alphabetically
        const categoriesArray = Array.from(categoryMap.values()).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setCategories(categoriesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 font-serif text-center">Recipe Categories</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No categories found.</p>
          <Link 
            href="/recipes"
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            View all recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <Link 
              key={category.name}
              href={`/recipes?category=${encodeURIComponent(category.name)}`}
              className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    background: getCategoryGradient(category.name),
                  }}
                >
                  <div className="text-4xl mb-3 text-white">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-white text-sm">{category.count} {category.count === 1 ? 'Recipe' : 'Recipes'}</p>
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
