import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryBySlug, getRecipesByCategory, getAllCategorySlugs } from '@/lib/api';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }
  
  // Get recipes for this category
  const recipes = await getRecipesByCategory(params.slug);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/recipes/${recipe.slug}`} className="text-blue-600 hover:underline">
                  {recipe.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Brand: <Link href={`/brand/${recipe.brandSlug}`} className="text-blue-500 hover:underline">
                  {recipe.brand}
                </Link>
              </p>
              <p className="text-gray-600">{recipe.description}</p>
              <div className="mt-4">
                <Link 
                  href={`/recipes/${recipe.slug}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  return await getAllCategorySlugs();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<any> {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  return {
    title: `${category.name} Copycat Recipes | KnockoffKitchen`,
    description: category.description,
    keywords: ['copycat recipes', category.name, 'homemade', 'DIY', params.slug.replace(/-/g, ' ')],
  };
}
