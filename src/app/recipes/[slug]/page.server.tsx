// This function is needed for static site generation with dynamic routes
// For static export, we'll use a simple fallback approach
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

// This is a server component that just exports the generateStaticParams function
// The actual page content is in the client component (page.tsx)
export default function RecipeDetailPageServer() {
  return null;
}
