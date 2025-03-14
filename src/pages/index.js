import Link from 'next/link';
import { getAllRecipes, getAllCategories, getAllBrands } from '../lib/api';

export default function Home({ allRecipes, allCategories, allBrands }) {
  // Use the first 3 recipes as featured recipes
  const featuredRecipes = allRecipes.slice(0, 3);
  
  return (
    <main>
      <h1 className="text-4xl font-bold text-center my-8">Find Your Favorite Copycat Recipes</h1>
      
      {/* Recipe Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((category) => (
            <Link 
              href={`/category/${category.slug}`} 
              key={category.slug}
              className="block"
            >
              <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
                <div className="h-40 bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{category.name}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">{recipe.title}</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/recipes/${recipe.slug}`} className="text-red-600 hover:underline">
                    {recipe.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Brand: <Link href={`/brand/${recipe.brandSlug}`} className="text-red-500 hover:underline">
                    {recipe.brand}
                  </Link>
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <Link 
                  href={`/recipes/${recipe.slug}`}
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Popular Brands */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Popular Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBrands.map((brand, index) => (
            <Link 
              key={index} 
              href={`/brand/${brand.slug}`}
              className="block bg-white hover:bg-gray-50 transition-colors p-4 rounded-lg border border-gray-200 text-center"
            >
              <h3 className="text-lg font-semibold">{brand.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      {/* About Section */}
      <section className="bg-red-600 text-white p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">About KnockoffKitchen</h2>
        <p className="mb-4">
          KnockoffKitchen is your source for recreating famous brand-name foods at home. 
          Our copycat recipes let you enjoy your favorite snacks and treats with healthier 
          ingredients, at a fraction of the cost.
        </p>
        <p>
          Browse our collection of recipes by brand or category, and start cooking today!
        </p>
      </section>
    </main>
  );
}

export async function getStaticProps() {
  const allRecipes = await getAllRecipes();
  const allCategories = await getAllCategories();
  const allBrands = await getAllBrands();
  
  return {
    props: {
      allRecipes,
      allCategories,
      allBrands,
    },
  };
}
