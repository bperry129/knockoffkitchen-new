"use client";

import { useEffect } from 'react';

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
  imageUrl?: string;
  productName: string;
  brandName: string;
}

// Helper function to convert time strings like "30 minutes" to ISO 8601 duration format "PT30M"
const convertTimeToISO8601 = (timeString: string): string => {
  const match = timeString.match(/(\d+)\s*(minutes|minute|mins|min|hours|hour|hrs|hr)/i);
  if (!match) return "PT30M"; // Default to 30 minutes if format is not recognized
  
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('hour')) {
    return `PT${value}H`;
  } else {
    return `PT${value}M`;
  }
};

export default function RecipeStructuredData({ recipe }: { recipe: Recipe }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Create the structured data
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": recipe.title,
      "description": recipe.introduction,
      "author": {
        "@type": "Organization",
        "name": "KnockoffKitchen"
      },
      "image": recipe.imageUrl || "https://knockoffkitchen-new.netlify.app/logo.png",
      "recipeCategory": recipe.category,
      "recipeCuisine": "American",
      "keywords": `copycat recipe, ${recipe.productName}, ${recipe.brandName}, homemade`,
      "recipeYield": recipe.recipeDetails.yield,
      "prepTime": convertTimeToISO8601(recipe.recipeDetails.prepTime),
      "cookTime": convertTimeToISO8601(recipe.recipeDetails.cookTime),
      "totalTime": convertTimeToISO8601(recipe.recipeDetails.totalTime),
      "recipeIngredient": recipe.ingredients.us,
      "recipeInstructions": recipe.instructions.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": step
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "25"
      },
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "1 serving"
      }
    };

    // Add the structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'recipe-structured-data';
    
    // Remove any existing structured data script to avoid duplicates
    const existingScript = document.getElementById('recipe-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById('recipe-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [recipe]);

  // This component doesn't render anything visible
  return null;
}
