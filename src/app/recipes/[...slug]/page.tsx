import { Suspense } from 'react';
import ClientPage from '../[slug]/page.client';

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

// This is a catch-all route that will handle all recipe slugs
export default function RecipeCatchAllPage({ params }: { params: { slug: string[] } }) {
  // Extract the slug from the params
  const slug = params.slug.join('/');
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage 
        params={{ slug }} 
        searchParamsEntries={[]} 
      />
    </Suspense>
  );
}

// This is a catch-all fallback for all recipe slugs
// We'll use Netlify redirects to handle dynamic routes
export function generateStaticParams() {
  // Return a minimal set of static paths for initial build
  // The rest will be handled by client-side rendering and Netlify redirects
  return [
    { slug: ['index'] }, // For the recipes index page
    { slug: ['placeholder'] } // A placeholder for all other recipes
  ];
}
