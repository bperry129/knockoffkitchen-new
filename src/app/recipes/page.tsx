"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SearchParamsWrapper from './search-params-wrapper';

// Fallback data for static site generation
const fallbackRecipes = [
  {
    id: 'fallback1',
    title: 'Homemade Doritos Nacho Cheese',
    category: 'Chips',
    introduction: 'Make your own crispy, cheesy Doritos at home with this copycat recipe that tastes just like the original!',
    recipeDetails: {
      prepTime: '20 minutes',
      cookTime: '15 minutes',
      totalTime: '35 minutes',
      yield: '6 servings'
    },
    productName: 'Doritos Nacho Cheese',
    brandName: 'Doritos',
    slug: 'homemade-doritos-nacho-cheese',
    createdAt: { seconds: 1647532800, nanoseconds: 0 },
    imageUrl: 'https://assets.syndigo.cloud/cdn/7d1ecfdf-a3d9-4851-85fa-d6730634e8d7/fileType_jpg;size_600x600/7d1ecfdf-a3d9-4851-85fa-d6730634e8d7'
  },
  {
    id: 'fallback2',
    title: 'Homemade Oreo Cookies',
    category: 'Cookies',
    introduction: 'Recreate the magic of America\'s favorite cookie with this spot-on Oreo copycat recipe!',
    recipeDetails: {
      prepTime: '30 minutes',
      cookTime: '10 minutes',
      totalTime: '40 minutes',
      yield: '24 cookies'
    },
    productName: 'Oreo Cookies',
    brandName: 'Nabisco',
    slug: 'homemade-oreo-cookies',
    createdAt: { seconds: 1647532800, nanoseconds: 0 }
  }
];

interface Recipe {
  id: string;
  title: string;
  category: string;
  introduction: string;
  recipeDetails: {
    prepTime: string;
    cookTime: string;
    totalTime: string;
    yield: string;
  };
  productName: string;
  brandName: string;
  slug: string;
  createdAt: any;
  imageUrl?: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle category change from URL parameters
  const handleCategoryChange = useCallback((category: string | null) => {
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const recipesQuery = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        if (recipesSnapshot.empty) {
          setRecipes([]);
          setLoading(false);
          return;
        }
        
        const recipesData = recipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(recipesData.map(recipe => recipe.category)))
          .filter(Boolean) // Remove empty categories
          .sort();
        
        setRecipes(recipesData);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchRecipes();
  }, []);

  // Filter recipes by category
  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Wrap useSearchParams in a Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsWrapper onCategoryChange={handleCategoryChange} />
      </Suspense>
      
      <h1 className="text-3xl font-bold mb-6 font-serif text-center">Copycat Recipes</h1>
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Recipes
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recipes found.</p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              View all recipes
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => (
            <Link 
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <img 
                  src={recipe.imageUrl || "https://placehold.co/600x400/e2e8f0/1e293b?text=Recipe+Image"} 
                  alt={`Homemade ${recipe.productName} recipe`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Recipe+Image";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {recipe.category || 'Uncategorized'}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{recipe.title}</h2>
                
                <p className="text-gray-600 mb-4 text-sm">
                  <span className="font-medium">Original:</span> {recipe.productName} by {recipe.brandName}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                  <span>Prep: {recipe.recipeDetails.prepTime}</span>
                  <span>•</span>
                  <span>Cook: {recipe.recipeDetails.cookTime}</span>
                  <span>•</span>
                  <span>Yield: {recipe.recipeDetails.yield}</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{recipe.introduction}</p>
                
                <div 
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md px-4 py-2 transition-all duration-300"
                >
                  View Recipe
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
