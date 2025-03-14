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

// Generate a few static paths for the most common recipes
export function generateStaticParams() {
  return [
    { slug: ['homemade-doritos-nacho-cheese'] },
    { slug: ['homemade-pringles-original'] },
    { slug: ['homemade-oreo-cookies'] },
    { slug: ['homemade-heinz-ketchup'] },
    { slug: ['homemade-lays-potato-chips'] },
    { slug: ['homemade-doritos-nacho-cheese-tortilla-chips-a-crispy-copycat-recipe'] }
  ];
}
