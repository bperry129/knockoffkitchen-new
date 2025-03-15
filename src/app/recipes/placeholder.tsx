import { Suspense } from 'react';
import ClientPage from './[slug]/page.client';

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
  // We'll use client-side rendering to fetch the actual recipe data
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage 
        params={{ slug: 'placeholder' }} 
        searchParamsEntries={[]} 
      />
    </Suspense>
  );
}
