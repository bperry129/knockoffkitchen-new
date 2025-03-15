"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ClientWrapperProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export default function ClientWrapper({ 
  categories, 
  onCategorySelect, 
  selectedCategory 
}: ClientWrapperProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get('category') : null;
  
  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      onCategorySelect(categoryParam);
    }
  }, [categoryParam, onCategorySelect]);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onCategorySelect('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Recipes
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
