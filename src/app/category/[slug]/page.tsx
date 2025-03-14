import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Define the Category type
interface Category {
  name: string;
  description: string;
  recipes: Array<{
    title: string;
    slug: string;
    brand: string;
    brandSlug: string;
    description: string;
  }>;
}

// This is a placeholder for actual data fetching
const getCategoryData = async (slug: string): Promise<Category | null> => {
  // In a real app, you would fetch data from an API or database
  // For now, we'll just return mock data
  const mockCategories: Record<string, Category> = {
    'chips': {
      name: 'Chips & Crisps',
      description: 'Make your favorite store-bought chips and crisps at home with these copycat recipes. Healthier, fresher, and often tastier than the originals!',
      recipes: [
        {
          title: 'Copycat Pringles BBQ Chips',
          slug: 'pringles-bbq-chips-copycat',
          brand: 'Pringles',
          brandSlug: 'pringles',
          description: 'Make your own BBQ Pringles at home with this copycat recipe.'
        },
        {
          title: 'Copycat Doritos Cool Ranch',
          slug: 'doritos-cool-ranch-copycat',
          brand: 'Doritos',
          brandSlug: 'doritos',
          description: 'Recreate the classic Cool Ranch Doritos flavor at home.'
        },
        {
          title: 'Copycat Lay\'s Salt & Vinegar Chips',
          slug: 'lays-salt-vinegar-chips-copycat',
          brand: 'Lay\'s',
          brandSlug: 'lays',
          description: 'The perfect tangy and salty homemade potato chips.'
        }
      ]
    }
  };

  return slug in mockCategories ? mockCategories[slug] : null;
};

// Use the correct Next.js types
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryData = await getCategoryData(params.slug);
  
  if (!categoryData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{categoryData.name}</h1>
      <p className="text-gray-600 mb-8">{categoryData.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData.recipes.map((recipe, index) => (
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
  // In a real app, you would fetch all category slugs from an API or database
  // For now, we'll just return the mock categories
  return [
    { slug: 'chips' },
    { slug: 'cookies' },
    { slug: 'sauces' }
  ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<any> {
  const categoryData = await getCategoryData(params.slug);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  return {
    title: `${categoryData.name} Copycat Recipes | KnockoffKitchen`,
    description: categoryData.description,
    keywords: ['copycat recipes', categoryData.name, 'homemade', 'DIY', params.slug.replace(/-/g, ' ')],
  };
}
