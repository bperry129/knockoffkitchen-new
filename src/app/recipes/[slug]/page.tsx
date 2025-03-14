import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getRecipeBySlug, getAllRecipeSlugs } from '@/lib/api';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);
  
  if (!recipe) {
    notFound();
  }

  // Create JSON-LD schema for the recipe
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.description,
    "image": recipe.image,
    "author": {
      "@type": "Organization",
      "name": "KnockoffKitchen"
    },
    "recipeCategory": recipe.category,
    "recipeCuisine": "American",
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map((step: string) => ({
      "@type": "HowToStep",
      "text": step
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "120"
    }
  };

  return (
    <>
      {/* Add JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{recipe.title}</h1>
        
        {/* Image placeholder */}
        <div className="bg-gray-200 rounded-md w-full h-64 flex items-center justify-center mb-6">
          <span className="text-gray-500 font-medium">Recipe Image</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border-l-4 border-red-500">
          <p className="text-gray-700">{recipe.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-gray-100 px-4 py-2 rounded-full">
            <span className="font-semibold text-gray-700">Brand:</span>{' '}
            <Link href={`/brand/${recipe.brandSlug}`} className="text-red-600 hover:underline">
              {recipe.brand}
            </Link>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-full">
            <span className="font-semibold text-gray-700">Category:</span>{' '}
            <Link href={`/category/${recipe.categorySlug}`} className="text-red-600 hover:underline">
              {recipe.category}
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index} className="pl-2">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-4">
            {recipe.instructions.map((step: string, index: number) => (
              <li key={index} className="pl-2">{step}</li>
            ))}
          </ol>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Share this recipe</h3>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Facebook
            </button>
            <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">
              Twitter
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Pinterest
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// Generate static paths for all recipes
export async function generateStaticParams() {
  return await getAllRecipeSlugs();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<any> {
  const recipe = await getRecipeBySlug(params.slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    };
  }
  
  return {
    title: `${recipe.title} | KnockoffKitchen`,
    description: recipe.description,
    keywords: ['copycat recipe', recipe.brand, recipe.category, 'homemade', 'DIY', params.slug.replace(/-/g, ' ')],
  };
}
