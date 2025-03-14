// This function is needed for static site generation with dynamic routes
// For static export, we'll use a simple hardcoded approach
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
