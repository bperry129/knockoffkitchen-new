"use client";

import { useState, useEffect } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function RecipeCounter() {
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipeCount() {
      try {
        const recipesCollection = collection(db, "recipes");
        const snapshot = await getCountFromServer(recipesCollection);
        setRecipeCount(snapshot.data().count);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe count:", error);
        setLoading(false);
      }
    }

    fetchRecipeCount();
  }, []);

  if (loading) {
    return (
      <div className="bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center">
      <i className="fas fa-book-open mr-2"></i>
      <span className="font-bold">{recipeCount || 0}</span>
      <span className="ml-1">homemade recipes</span>
    </div>
  );
}
