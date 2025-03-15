"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface SearchParamsWrapperProps {
  onCategoryChange: (category: string | null) => void;
}

export default function SearchParamsWrapper({ onCategoryChange }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get('category') : null;
  
  useEffect(() => {
    onCategoryChange(categoryParam);
  }, [categoryParam, onCategoryChange]);
  
  // This component doesn't render anything
  return null;
}
