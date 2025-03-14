"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';

// Define the Recipe interface for the comprehensive format
interface Recipe {
  title: string;
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
  category: string;
}

export default function GenerateRecipePage() {
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('main'); // For tabbed navigation
  const [dbSaveStatus, setDbSaveStatus] = useState<{
    success: boolean;
    message: string;
    id?: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecipe(null);
    setDbSaveStatus(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, brandName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      
      // Check if the recipe was saved to the database
      if (data.id) {
        setDbSaveStatus({
          success: true,
          message: 'Recipe saved to database successfully!',
          id: data.id
        });
      } else if (data.dbSaveError) {
        setDbSaveStatus({
          success: false,
          message: `Recipe generated but not saved to database: ${data.dbErrorMessage || 'Unknown error'}`
        });
        // Remove the error properties from the recipe data
        const { dbSaveError, dbErrorMessage, ...recipeData } = data;
        setRecipe(recipeData);
      } else {
        setRecipe(data);
      }
      
      setActiveTab('main'); // Reset to main tab when new recipe is generated
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred while generating the recipe';
      setError(errorMessage);
      console.error('Recipe generation error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 font-serif text-center">Generate Copycat Recipe</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Cool Ranch Doritos"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name
            </label>
            <input
              type="text"
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., Doritos"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recipe...
                </div>
              ) : (
                'Generate Recipe'
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {dbSaveStatus && (
        <div className={`${dbSaveStatus.success ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'} border-l-4 p-4 mb-8`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {dbSaveStatus.success ? (
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${dbSaveStatus.success ? 'text-green-700' : 'text-yellow-700'}`}>
                {dbSaveStatus.message}
              </p>
              {dbSaveStatus.id && (
                <p className="text-sm text-green-600 mt-1">
                  Recipe ID: {dbSaveStatus.id}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {recipe && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {recipe.category}
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
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* US Measurements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">🥣</span>
                      <span>Ingredients (US)</span>
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recipe.ingredients.us.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Metric Measurements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">🧪</span>
                      <span>Ingredients (Metric)</span>
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recipe.ingredients.metric.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mb-8">
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
      )}
      
      <div className="mt-8 text-center">
        <Link 
          href="/"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
