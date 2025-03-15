"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useParams } from 'next/navigation';

// Fallback data for static site generation
const fallbackRecipeData = {
  id: 'fallback1',
  title: 'Homemade Doritos Nacho Cheese: A Copycat Recipe Better Than Store-Bought',
  category: 'Chips',
  introduction: 'Make your own crispy, cheesy Doritos at home with this copycat recipe that tastes just like the original but with better ingredients and customizable flavors!',
  recipeDetails: {
    prepTime: '20 minutes',
    cookTime: '15 minutes',
    totalTime: '35 minutes',
    yield: '6 servings'
  },
  ingredients: {
    us: [
      '6 corn tortillas',
      '2 tablespoons vegetable oil',
      '1 tablespoon nutritional yeast',
      '1 teaspoon garlic powder',
      '1 teaspoon onion powder',
      '1 teaspoon paprika',
      '1/2 teaspoon cumin',
      '1/2 teaspoon chili powder',
      '1/4 teaspoon cayenne pepper (optional)',
      '1/2 teaspoon salt'
    ],
    metric: [
      '6 corn tortillas',
      '30 ml vegetable oil',
      '15 g nutritional yeast',
      '5 g garlic powder',
      '5 g onion powder',
      '5 g paprika',
      '2.5 g cumin',
      '2.5 g chili powder',
      '1.25 g cayenne pepper (optional)',
      '2.5 g salt'
    ]
  },
  instructions: [
    'Preheat your oven to 350°F (175°C).',
    'Cut each corn tortilla into 6 triangular pieces, similar to the shape of Doritos.',
    'In a large bowl, toss the tortilla pieces with vegetable oil until lightly coated.',
    'In a small bowl, mix together the nutritional yeast, garlic powder, onion powder, paprika, cumin, chili powder, cayenne pepper (if using), and salt.',
    'Sprinkle the seasoning mixture over the oiled tortilla pieces and toss until evenly coated.',
    'Arrange the seasoned tortilla pieces in a single layer on baking sheets.',
    'Bake for 12-15 minutes, or until the chips are crispy and golden brown.',
    'Allow to cool completely before serving to achieve maximum crispness.'
  ],
  storageInstructions: 'Store in an airtight container at room temperature for up to 5 days. For maximum crispness, add a silica gel packet or a piece of paper towel to absorb moisture.',
  variations: {
    healthy: 'For a healthier version, use olive oil instead of vegetable oil and reduce the salt by half. You can also bake them at a lower temperature for longer to reduce oil content.',
    spicy: 'Double the amount of cayenne pepper and add 1/2 teaspoon of chipotle powder for a spicier kick that mimics Flamin\' Hot Doritos.',
    dietary: 'This recipe is already vegan and can be made gluten-free by ensuring your corn tortillas are certified gluten-free.'
  },
  equipment: [
    'Baking sheets',
    'Mixing bowls',
    'Sharp knife or pizza cutter',
    'Measuring spoons'
  ],
  proTips: [
    'For extra cheesy flavor, double the nutritional yeast.',
    'If the chips aren\'t crispy enough after baking, turn off the oven and leave them inside with the door cracked open for an additional 10 minutes.',
    'For a more authentic color, add a pinch of turmeric or annatto powder to the seasoning mix.'
  ],
  nutritionalComparison: {
    homemade: {
      calories: '120 per serving',
      fat: '5g',
      sugar: '0g',
      sodium: '180mg',
      protein: '2g',
      fiber: '2g'
    },
    storeBought: {
      calories: '150 per serving',
      fat: '8g',
      sugar: '1g',
      sodium: '310mg',
      protein: '2g',
      fiber: '1g'
    }
  },
  faq: [
    {
      question: 'Can I use store-bought tortilla chips instead of making them from scratch?',
      answer: 'Yes, you can use plain store-bought tortilla chips and just add the seasoning. Lightly spray the chips with oil first so the seasoning sticks better.'
    },
    {
      question: 'How can I make these chips even crispier?',
      answer: 'For extra crispiness, let the tortillas dry out for a few hours or overnight before cutting and baking them.'
    },
    {
      question: 'Can I fry these instead of baking them?',
      answer: 'Absolutely! Deep fry the tortilla pieces at 350°F (175°C) for about 2-3 minutes until golden, then immediately toss in the seasoning mix while still hot.'
    },
    {
      question: 'What can I substitute for nutritional yeast?',
      answer: 'If you don\'t have nutritional yeast, you can use powdered cheese (like from a mac and cheese packet) or a combination of Parmesan cheese powder and a pinch of MSG.'
    },
    {
      question: 'How do I scale this recipe for a party?',
      answer: 'This recipe scales well - simply multiply all ingredients by the desired factor. For a party, we recommend making at least 3-4 batches.'
    }
  ],
  servingSuggestions: [
    'Serve with homemade guacamole or salsa for dipping',
    'Use as a topping for taco salad',
    'Crush and use as a crunchy coating for chicken or fish',
    'Sprinkle over mac and cheese for added texture and flavor'
  ],
  costComparison: {
    homemade: '$0.75',
    storeBought: '$1.25',
    savings: '40%'
  },
  conclusion: "These homemade Doritos-style chips give you all the bold, cheesy flavor of the original but with better ingredients and endless customization options. Plus, they are more economical and have a fresher taste than anything that comes out of a bag. Once you try making these at home, you might never go back to store-bought!",
  productName: 'Doritos Nacho Cheese',
  brandName: 'Doritos',
  slug: 'homemade-doritos-nacho-cheese',
  imageUrl: 'https://assets.syndigo.cloud/cdn/7d1ecfdf-a3d9-4851-85fa-d6730634e8d7/fileType_jpg;size_600x600/7d1ecfdf-a3d9-4851-85fa-d6730634e8d7'
};

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
  ingredients: {
    us: string[];
    metric: string[];
  };
  instructions: string[];
  storageInstructions: string;
  variations: {
    healthy: string;
    spicy: string;
    dietary: string;
    [key: string]: string;
  };
  equipment: string[];
  proTips: string[];
  nutritionalComparison: {
    homemade: {
      calories: string;
      fat: string;
      sugar: string;
      [key: string]: string;
    };
    storeBought: {
      calories: string;
      fat: string;
      sugar: string;
      [key: string]: string;
    };
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  servingSuggestions: string[];
  costComparison: {
    homemade: string;
    storeBought: string;
    savings: string;
  };
  conclusion: string;
  productName: string;
  brandName: string;
  slug: string;
  imageUrl?: string;
}

// Define the props type for the page component
interface PageProps {
  params: { slug: string };
  searchParamsEntries?: [string, string | string[] | undefined][];
}

export default function RecipeDetailClientPage(props: PageProps) {
  const routeParams = useParams();
  // Use the slug from props if available, otherwise fallback to useParams
  const slug = props.params?.slug || (routeParams?.slug as string) || '';
  
  // Convert searchParamsEntries back to an object if needed
  const searchParams = props.searchParamsEntries ? 
    Object.fromEntries(props.searchParamsEntries) : 
    {};
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [measurementSystem, setMeasurementSystem] = useState<'us' | 'metric'>('us');

  useEffect(() => {
    // Skip data fetching during static site generation
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Use a timeout to prevent long-running operations
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Using fallback data.');
    }, 5000); // 5 second timeout

    async function fetchRecipe() {
      try {
        const recipesQuery = query(collection(db, "recipes"), where("slug", "==", slug));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        if (recipesSnapshot.empty) {
          setError('Recipe not found');
          setLoading(false);
          return;
        }
        
        const recipeData = {
          id: recipesSnapshot.docs[0].id,
          ...recipesSnapshot.docs[0].data(),
        } as Recipe;
        
        setRecipe(recipeData);
        setLoading(false);
      } catch (err) {
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Using fallback data.');
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchRecipe();
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [slug]);

  // Table of contents component
  const TableOfContents = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
      <ul className="space-y-2">
        <li>
          <a href="#recipe" className="text-indigo-600 hover:text-indigo-800">Recipe</a>
        </li>
        <li>
          <a href="#variations" className="text-indigo-600 hover:text-indigo-800">Variations</a>
        </li>
        <li>
          <a href="#tips" className="text-indigo-600 hover:text-indigo-800">Tips & Equipment</a>
        </li>
        <li>
          <a href="#nutrition" className="text-indigo-600 hover:text-indigo-800">Nutrition & Cost</a>
        </li>
        <li>
          <a href="#faq" className="text-indigo-600 hover:text-indigo-800">FAQ</a>
        </li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Use fallback data if no recipe is found or there's an error
  // This ensures the page works for static site generation
  const recipeData = recipe || fallbackRecipeData;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{recipeData.title}</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {recipeData.category || 'Uncategorized'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Prep: {recipeData.recipeDetails.prepTime}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Cook: {recipeData.recipeDetails.cookTime}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Yield: {recipeData.recipeDetails.yield}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {/* Table of Contents */}
          <TableOfContents />
          
          {/* Recipe Section */}
          <section id="recipe" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Recipe</h2>
            
            {recipeData.imageUrl && (
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-lg h-64 rounded-lg overflow-hidden">
                  <img 
                    src={recipeData.imageUrl} 
                    alt={`${recipeData.productName} by ${recipeData.brandName}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            
            <div className="prose max-w-none mb-6">
              <p>{recipeData.introduction}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-end">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setMeasurementSystem('us')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      measurementSystem === 'us'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    US
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasurementSystem('metric')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      measurementSystem === 'metric'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Metric
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="mr-2">🥣</span>
                  <span>Ingredients ({measurementSystem === 'us' ? 'US' : 'Metric'})</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recipeData.ingredients[measurementSystem].map((ingredient, index) => (
                    <li key={index} className="text-gray-700">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="mr-2">👨‍🍳</span>
                  <span>Instructions</span>
                </h3>
                <ol className="list-decimal pl-5 space-y-3">
                  {recipeData.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <span className="mr-2">❄️</span>
                <span>Storage Instructions</span>
              </h3>
              <p className="text-gray-700">{recipeData.storageInstructions}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <span className="mr-2">🍽️</span>
                <span>Serving Suggestions</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipeData.servingSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          </section>
          
          {/* Variations Section */}
          <section id="variations" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Recipe Variations</h2>
            
            <div className="space-y-6">
              {Object.entries(recipeData.variations).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-lg mb-2 capitalize">{key} Version</h4>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-indigo-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Conclusion</h3>
              <p className="text-gray-700">{recipeData.conclusion}</p>
            </div>
          </section>
          
          {/* Tips & Equipment Section */}
          <section id="tips" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Tips & Equipment</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
              <div className="bg-yellow-50 p-4 rounded-md">
                <ul className="space-y-4">
                  {recipeData.proTips.map((tip, index) => (
                    <li key={index} className="flex">
                      <span className="text-yellow-500 font-bold mr-2">💡</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Special Equipment</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="grid grid-cols-2 gap-2">
                  {recipeData.equipment.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-gray-500 mr-2">🔧</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          {/* Nutrition & Cost Section */}
          <section id="nutrition" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Nutrition & Cost</h2>
            
            <h3 className="text-xl font-semibold mb-4">Nutritional Comparison</h3>
            
            <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrient</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homemade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store-Bought</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(recipeData.nutritionalComparison.homemade).map(([nutrient, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{nutrient}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recipeData.nutritionalComparison.storeBought[nutrient as keyof typeof recipeData.nutritionalComparison.storeBought] || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Cost Comparison</h3>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 uppercase">Homemade</h4>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">{recipeData.costComparison.homemade}</p>
                  <p className="mt-1 text-sm text-gray-500">per serving</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 uppercase">Store-Bought</h4>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">{recipeData.costComparison.storeBought}</p>
                  <p className="mt-1 text-sm text-gray-500">per serving</p>
                </div>
                
                <div className="text-center p-4 bg-green-100 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 uppercase">Savings</h4>
                  <p className="mt-2 text-3xl font-extrabold text-green-600">{recipeData.costComparison.savings}</p>
                  <p className="mt-1 text-sm text-gray-500">by making at home</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section id="faq">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {recipeData.faq.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3">
                    <h4 className="text-md font-medium text-gray-900">{item.question}</h4>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/recipes"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Recipes
        </Link>
      </div>
    </div>
  );
}
