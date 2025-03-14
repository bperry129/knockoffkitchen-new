import React from 'react';
import { notFound } from 'next/navigation';

// Define the Recipe type
interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

// This is a placeholder for actual data fetching
const getRecipeData = async (slug: string): Promise<Recipe | null> => {
  // In a real app, you would fetch data from an API or database
  // For now, we'll just return mock data
  const mockRecipes: Record<string, Recipe> = {
    'pringles-bbq-chips-copycat': {
      title: 'Copycat Pringles BBQ Chips',
      description: 'Make your own BBQ Pringles at home with this copycat recipe.',
      ingredients: [
        '1 cup potato flakes',
        '1/2 cup potato starch',
        '1/4 cup rice flour',
        '1 tsp BBQ seasoning',
        '1/2 tsp salt',
        '1/4 tsp paprika',
        '1/4 tsp garlic powder',
        '1/4 tsp onion powder',
        '2 tbsp vegetable oil',
        '1/2 cup water'
      ],
      instructions: [
        'Mix dry ingredients in a bowl.',
        'Add oil and water, mix until a smooth dough forms.',
        'Roll dough very thin between parchment paper.',
        'Cut into chip shapes.',
        'Bake at 350°F for 10-15 minutes until crispy.',
        'Let cool completely before serving.'
      ]
    }
  };

  return slug in mockRecipes ? mockRecipes[slug] : null;
};

// Use the correct Next.js types
export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipeData = await getRecipeData(params.slug);
  
  if (!recipeData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{recipeData.title}</h1>
      <p className="text-gray-600 mb-8">{recipeData.description}</p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {recipeData.ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-4">
          {recipeData.instructions.map((step: string, index: number) => (
            <li key={index} className="pl-2">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<any> {
  const recipeData = await getRecipeData(params.slug);
  
  if (!recipeData) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    };
  }
  
  return {
    title: `${recipeData.title} | KnockoffKitchen`,
    description: recipeData.description,
    keywords: ['copycat recipe', 'homemade', 'DIY', params.slug.replace(/-/g, ' ')],
  };
}
