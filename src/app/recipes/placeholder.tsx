"use client";

import { Suspense, useEffect, useState } from 'react';
import ClientPage from './[slug]/page.client';
import { usePathname } from 'next/navigation';

// Simple loading component to use with Suspense
function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-center">
          <p className="text-lg text-gray-500">Loading recipe...</p>
        </div>
      </div>
    </div>
  );
}

// This is a placeholder page that will be used for all dynamic recipe slugs
export default function PlaceholderPage() {
  const pathname = usePathname();
  const [slug, setSlug] = useState<string>('placeholder');

  useEffect(() => {
    // Extract the slug from the URL path
    if (pathname) {
      const pathParts = pathname.split('/');
      if (pathParts.length > 2) {
        const extractedSlug = pathParts[2]; // /recipes/[slug]
        console.log('Extracted slug from URL:', extractedSlug);
        setSlug(extractedSlug);
      }
    }
  }, [pathname]);

  // We'll use client-side rendering to fetch the actual recipe data
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage 
        params={{ slug }} 
        searchParamsEntries={[]} 
      />
    </Suspense>
  );
}
