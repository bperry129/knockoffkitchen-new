import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBrandBySlug, getRecipesByBrand } from '../../lib/api';

// This is a wrapper component that uses the same data as the App Router version
export default function BrandPage({ brand, recipes }) {
  const router = useRouter();
  
  // If the page is still generating via fallback, show loading
  if (router.isFallback) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Loading...</div>;
  }
  
  // If no brand was found, show not found message
  if (!brand) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
        <p className="mb-4">The brand you're looking for could not be found.</p>
        <Link 
          href="/brands"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View All Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-4">{brand.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Founded:</span> {brand.foundedYear || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Headquarters:</span> {brand.headquarters || 'N/A'}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Copycat Recipes</h2>
        <p className="mb-4">Try our copycat recipes for these popular {brand.name} products:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/recipes/${recipe.slug}`} className="text-blue-600 hover:underline">
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  <Link 
                    href={`/recipes/${recipe.slug}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found for this brand.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // Get all brand slugs from the API
  const paths = await getBrandSlugs();
  
  return {
    paths,
    fallback: true, // Enable fallback for paths not generated at build time
  };
}

// Helper function to get brand slugs
async function getBrandSlugs() {
  try {
    // Import the getAllBrandSlugs function
    const { getAllBrandSlugs } = require('../../lib/api');
    
    // Get all brand slugs
    const slugs = await getAllBrandSlugs();
    
    // Format the slugs for Next.js
    return slugs.map(({ slug }) => ({
      params: { slug },
    }));
  } catch (error) {
    console.error('Error getting brand slugs:', error);
    return [];
  }
}

// This function gets called at build time and on client-side navigation
export async function getStaticProps({ params }) {
  try {
    // Get the brand data
    const brand = await getBrandBySlug(params.slug);
    
    // If no brand was found, return 404
    if (!brand) {
      return {
        notFound: true,
      };
    }
    
    // Get recipes for this brand
    const recipes = await getRecipesByBrand(params.slug);
    
    // Return the props
    return {
      props: {
        brand,
        recipes,
      },
      // Re-generate the page at most once per day
      revalidate: 86400,
    };
  } catch (error) {
    console.error(`Error getting brand ${params.slug}:`, error);
    return {
      notFound: true,
    };
  }
}
