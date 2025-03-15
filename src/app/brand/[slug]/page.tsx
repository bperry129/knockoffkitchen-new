import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBrandBySlug, getRecipesByBrand, getAllBrandSlugs } from '@/lib/api';

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const brand = await getBrandBySlug(params.slug);
  
  if (!brand) {
    notFound();
  }
  
  // Get recipes for this brand
  const recipes = await getRecipesByBrand(params.slug);

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/recipes/${recipe.slug}`} className="text-blue-600 hover:underline">
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  <Link 
                    href={`/recipes/${recipe.slug}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found for this brand.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate static paths for all brands
export async function generateStaticParams() {
  try {
    // Get all brand slugs
    const slugs = await getAllBrandSlugs();
    
    // Return the slugs for static generation
    return slugs;
  } catch (error) {
    console.error('Error generating static params for brands:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<any> {
  const brand = await getBrandBySlug(params.slug);
  
  if (!brand) {
    return {
      title: 'Brand Not Found',
      description: 'The requested brand could not be found.'
    };
  }
  
  return {
    title: `${brand.name} Copycat Recipes | KnockoffKitchen`,
    description: `Learn how to make your favorite ${brand.name} products at home with our copycat recipes.`,
    keywords: ['copycat recipes', brand.name, 'homemade', 'DIY'],
  };
}
