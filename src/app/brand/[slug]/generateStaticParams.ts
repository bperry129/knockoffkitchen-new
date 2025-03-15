// This function is needed for static site generation with dynamic routes
// For static export, we'll use a minimal approach and rely on client-side rendering
export async function generateStaticParams() {
  // Return a minimal set of static paths for initial build
  // The rest will be handled by client-side rendering and Netlify redirects
  return [
    { slug: 'index' } // For the brands index page
  ];
}
