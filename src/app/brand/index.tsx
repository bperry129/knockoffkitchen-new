'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getBrandBySlug, getRecipesByBrand } from '@/lib/api';

// This is a client component that will be used as a placeholder for all brand pages
export default function BrandPlaceholder() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadBrandData() {
      try {
        // Extract the slug from the URL
        const pathParts = pathname?.split('/') || [];
        const slug = pathParts[pathParts.length - 1];
        
        console.log('Loading brand data for slug:', slug);
        
        if (!slug || slug === 'brand') {
          setError('Brand not found');
          setLoading(false);
          return;
        }
        
        // Fetch the brand data
        const brandData = await getBrandBySlug(slug);
        
        if (!brandData) {
          setError(`Brand "${slug}" not found`);
          setLoading(false);
          return;
        }
        
        console.log('Brand data loaded:', brandData);
        setBrand(brandData);
        
        // Fetch recipes for this brand
        console.log('Fetching recipes for brand:', slug);
        const recipesData = await getRecipesByBrand(slug);
        console.log('Recipes loaded:', recipesData?.length || 0);
        setRecipes(recipesData || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading brand data:', err);
        setError('Error loading brand data. Please try again later.');
        setLoading(false);
      }
    }
    
    if (pathname) {
      loadBrandData();
    }
  }, [pathname]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
        <p className="mb-4">{error}</p>
        <Link 
          href="/brands"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View All Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-4">{brand.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Founded:</span> {brand.foundedYear || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Headquarters:</span> {brand.headquarters || 'N/A'}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Copycat Recipes</h2>
        <p className="mb-4">Try our copycat recipes for these popular {brand.name} products:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <Link 
                key={index}
                href={`/recipes/${recipe.slug}`}
                className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full">
                  <img 
                    src={recipe.imageUrl || "https://placehold.co/600x400/e2e8f0/1e293b?text=Recipe+Image"} 
                    alt={`Homemade ${recipe.title} recipe`}
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
                    <span className="font-medium">Original:</span> {recipe.productName || recipe.title} by {recipe.brandName || brand.name}
                  </p>
                  
                  {recipe.recipeDetails && (
                    <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                      {recipe.recipeDetails.prepTime && <span>Prep: {recipe.recipeDetails.prepTime}</span>}
                      {recipe.recipeDetails.prepTime && recipe.recipeDetails.cookTime && <span>•</span>}
                      {recipe.recipeDetails.cookTime && <span>Cook: {recipe.recipeDetails.cookTime}</span>}
                      {recipe.recipeDetails.yield && <span>•</span>}
                      {recipe.recipeDetails.yield && <span>Yield: {recipe.recipeDetails.yield}</span>}
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>
                  
                  <div 
                    className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md px-4 py-2 transition-all duration-300"
                  >
                    View Recipe
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found for this brand.</p>
              <p className="mt-2 text-gray-400">Check back later for new recipes!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
