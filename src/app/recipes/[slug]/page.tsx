import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeBySlug, getAllRecipeSlugs } from '@/lib/api';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);
  
  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-4">{recipe.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Brand:</span>{' '}
            <Link href={`/brand/${recipe.brandSlug}`} className="text-blue-600 hover:underline">
              {recipe.brand}
            </Link>
          </div>
          <div>
            <span className="font-semibold">Category:</span>{' '}
            <Link href={`/category/${recipe.categorySlug}`} className="text-blue-600 hover:underline">
              {recipe.category}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-4">
          {recipe.instructions.map((step: string, index: number) => (
            <li key={index} className="pl-2">{step}</li>
          ))}
        </ol>
      </div>
    </div>
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
