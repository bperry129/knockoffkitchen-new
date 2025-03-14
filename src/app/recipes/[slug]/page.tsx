import ClientPage from './page.client';
import { Suspense } from 'react';

// This function is needed for static site generation with dynamic routes
export async function generateStaticParams() {
  // For static export, we'll return a few placeholder slugs
  // The actual content will be loaded client-side from Firebase
  return [
    { slug: 'homemade-doritos-nacho-cheese' },
    { slug: 'homemade-pringles-original' },
    { slug: 'homemade-oreo-cookies' },
    { slug: 'homemade-heinz-ketchup' },
    { slug: 'homemade-lays-potato-chips' }
  ];
}

// Define the props type for the page component
interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

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

// This is a server component that exports generateStaticParams
// and renders the client component with Suspense for better performance
export default function RecipeDetailPage({ params, searchParams = {} }: PageProps) {
  // Pass individual properties instead of the searchParams object
  const searchParamsEntries = Object.entries(searchParams);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage 
        params={params} 
        searchParamsEntries={searchParamsEntries} 
      />
    </Suspense>
  );
}
