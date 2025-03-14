"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useParams } from 'next/navigation';

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
}

export default function RecipeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [measurementSystem, setMeasurementSystem] = useState<'us' | 'metric'>('us');

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        const recipesQuery = query(collection(db, "recipes"), where("slug", "==", slug));
        const recipesSnapshot = await getDocs(recipesQuery);
        
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
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again later.');
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchRecipe();
    }
  }, [slug]);

  // Tab navigation component
  const TabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('main')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'main'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Recipe
        </button>
        <button
          onClick={() => setActiveTab('variations')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'variations'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Variations
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'tips'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Tips & Equipment
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'nutrition'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Nutrition & Cost
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'faq'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          FAQ
        </button>
      </nav>
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

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error || 'Recipe not found'}</p>
        </div>
        <Link 
          href="/recipes"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {recipe.category || 'Uncategorized'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Prep: {recipe.recipeDetails.prepTime}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Cook: {recipe.recipeDetails.cookTime}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Yield: {recipe.recipeDetails.yield}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {/* Tab Navigation */}
          <TabNavigation />
          
          {/* Main Tab - Recipe */}
          {activeTab === 'main' && (
            <div>
              <div className="prose max-w-none mb-6">
                <p>{recipe.introduction}</p>
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
                    {recipe.ingredients[measurementSystem].map((ingredient, index) => (
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
                    {recipe.instructions.map((instruction, index) => (
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
                <p className="text-gray-700">{recipe.storageInstructions}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-2 flex items-center">
                  <span className="mr-2">🍽️</span>
                  <span>Serving Suggestions</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recipe.servingSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Variations Tab */}
          {activeTab === 'variations' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Recipe Variations</h3>
              
              <div className="space-y-6">
                {Object.entries(recipe.variations).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-lg mb-2 capitalize">{key} Version</h4>
                    <p className="text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-indigo-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3">Conclusion</h3>
                <p className="text-gray-700">{recipe.conclusion}</p>
              </div>
            </div>
          )}
          
          {/* Tips & Equipment Tab */}
          {activeTab === 'tips' && (
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <ul className="space-y-4">
                    {recipe.proTips.map((tip, index) => (
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
                    {recipe.equipment.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-gray-500 mr-2">🔧</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Nutrition & Cost Tab */}
          {activeTab === 'nutrition' && (
            <div>
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
                    {Object.entries(recipe.nutritionalComparison.homemade).map(([nutrient, value], index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{nutrient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipe.nutritionalComparison.storeBought[nutrient] || 'N/A'}
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
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">{recipe.costComparison.homemade}</p>
                    <p className="mt-1 text-sm text-gray-500">per serving</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500 uppercase">Store-Bought</h4>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">{recipe.costComparison.storeBought}</p>
                    <p className="mt-1 text-sm text-gray-500">per serving</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-100 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500 uppercase">Savings</h4>
                    <p className="mt-2 text-3xl font-extrabold text-green-600">{recipe.costComparison.savings}</p>
                    <p className="mt-1 text-sm text-gray-500">by making at home</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                {recipe.faq.map((item, index) => (
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
            </div>
          )}
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
