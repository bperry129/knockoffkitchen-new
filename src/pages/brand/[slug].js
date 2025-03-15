import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBrandBySlug, getRecipesByBrand, getAllBrandSlugs } from '../../lib/api';

export default function BrandPage({ brand, recipes }) {
  const router = useRouter();

  // If the page is still being generated via fallback, show a loading state
  if (router.isFallback) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // If brand is not found, show a message
  if (!brand) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Brand Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the brand you're looking for.</p>
          <Link href="/brands" className="text-indigo-600 hover:text-indigo-800">
            View all brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{brand.name} Copycat Recipes</h1>
        <p className="text-lg text-gray-600 mb-6">{brand.description || `Delicious copycat recipes for ${brand.name} products.`}</p>
        <div className="flex gap-4">
          <Link href="/brands" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <i className="fas fa-arrow-left"></i>
            <span>All Brands</span>
          </Link>
          <Link href="/recipes" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <i className="fas fa-book"></i>
            <span>All Recipes</span>
          </Link>
        </div>
      </div>

      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-indigo-600 flex items-center justify-center">
                  {recipe.imageUrl ? (
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fas fa-utensils text-white text-5xl"></i>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      <i className="fas fa-tag mr-1"></i>
                      {recipe.category || 'Uncategorized'}
                    </span>
                    <span className="text-indigo-600 font-medium">View Recipe</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-cookie-bite text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500 text-lg">No recipes found for this brand.</p>
        </div>
      )}
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  const paths = await getAllBrandSlugs();
  
  return {
    paths: paths.map(({ slug }) => ({ params: { slug } })),
    fallback: true, // Enable fallback for paths not generated at build time
  };
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  const brand = await getBrandBySlug(params.slug);
  const recipes = await getRecipesByBrand(params.slug);
  
  return {
    props: {
      brand,
      recipes,
    },
    revalidate: 60, // Revalidate the page every 60 seconds
  };
}
