import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Define the Brand type
interface Brand {
  name: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  famousProducts: Array<{
    name: string;
    slug: string;
  }>;
}

// This is a placeholder for actual data fetching
const getBrandData = async (slug: string): Promise<Brand | null> => {
  // In a real app, you would fetch data from an API or database
  // For now, we'll just return mock data
  const mockBrands: Record<string, Brand> = {
    'pringles': {
      name: 'Pringles',
      description: 'Pringles is an American brand of stackable potato-based chips. Originally developed by Procter & Gamble in 1967 and marketed as "Pringle\'s Newfangled Potato Chips", the brand was sold to Kellogg\'s in 2012.',
      foundedYear: 1967,
      headquarters: 'Battle Creek, Michigan, USA',
      famousProducts: [
        {
          name: 'BBQ Pringles',
          slug: 'pringles-bbq-chips-copycat'
        },
        {
          name: 'Original Pringles',
          slug: 'pringles-original-chips-copycat'
        },
        {
          name: 'Sour Cream & Onion Pringles',
          slug: 'pringles-sour-cream-onion-copycat'
        }
      ]
    }
  };

  return slug in mockBrands ? mockBrands[slug] : null;
};

// Define the PageProps interface to match Next.js App Router requirements
interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BrandPage({ params }: PageProps) {
  const brandData = await getBrandData(params.slug);
  
  if (!brandData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{brandData.name}</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-4">{brandData.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Founded:</span> {brandData.foundedYear}
          </div>
          <div>
            <span className="font-semibold">Headquarters:</span> {brandData.headquarters}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Famous Products</h2>
        <p className="mb-4">Try our copycat recipes for these popular {brandData.name} products:</p>
        <ul className="space-y-2">
          {brandData.famousProducts.map((product, index) => (
            <li key={index} className="border-b border-gray-200 pb-2">
              <Link href={`/recipes/${product.slug}`} className="text-blue-600 hover:underline">
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<any> {
  const brandData = await getBrandData(params.slug);
  
  if (!brandData) {
    return {
      title: 'Brand Not Found',
      description: 'The requested brand could not be found.'
    };
  }
  
  return {
    title: `${brandData.name} Copycat Recipes | KnockoffKitchen`,
    description: `Learn how to make your favorite ${brandData.name} products at home with our copycat recipes.`,
    keywords: ['copycat recipes', brandData.name, 'homemade', 'DIY'],
  };
}
