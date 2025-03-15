"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
                <img 
                  src={category.imageUrl || "https://placehold.co/600x400/e2e8f0/1e293b?text=Category+Image"} 
                  alt={`${category.name} category`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Category+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <p className="text-white text-sm mt-2">{category.count} {category.count === 1 ? 'Recipe' : 'Recipes'}</p>
                  </div>
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
