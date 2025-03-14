import Image from "next/image";
import Link from "next/link";

// Define types for our featured content
interface FeaturedRecipe {
  title: string;
  slug: string;
  description: string;
  brand: string;
  brandSlug: string;
}

interface FeaturedCategory {
  name: string;
  slug: string;
  description: string;
}

interface FeaturedBrand {
  name: string;
  slug: string;
  logo?: string;
}

// Mock data for featured content
const featuredRecipes: FeaturedRecipe[] = [
  {
    title: "Copycat Pringles BBQ Chips",
    slug: "pringles-bbq-chips-copycat",
    description: "Make your own BBQ Pringles at home with this copycat recipe.",
    brand: "Pringles",
    brandSlug: "pringles"
  },
  {
    title: "Copycat Doritos Cool Ranch",
    slug: "doritos-cool-ranch-copycat",
    description: "Recreate the classic Cool Ranch Doritos flavor at home.",
    brand: "Doritos",
    brandSlug: "doritos"
  },
  {
    title: "Copycat Lay's Salt & Vinegar Chips",
    slug: "lays-salt-vinegar-chips-copycat",
    description: "The perfect tangy and salty homemade potato chips.",
    brand: "Lay's",
    brandSlug: "lays"
  }
];

const featuredCategories: FeaturedCategory[] = [
  {
    name: "Chips & Crisps",
    slug: "chips",
    description: "Make your favorite store-bought chips at home."
  },
  {
    name: "Cookies",
    slug: "cookies",
    description: "Recreate famous cookies with our copycat recipes."
  },
  {
    name: "Sauces & Dips",
    slug: "sauces",
    description: "Secret sauce recipes from your favorite restaurants."
  }
];

const featuredBrands: FeaturedBrand[] = [
  {
    name: "Pringles",
    slug: "pringles"
  },
  {
    name: "Doritos",
    slug: "doritos"
  },
  {
    name: "Lay's",
    slug: "lays"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">KnockoffKitchen</h1>
            <p className="text-xl md:text-2xl mb-8">
              Make your favorite brand-name foods at home with our copycat recipes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/category/chips" 
                className="bg-white text-blue-600 hover:bg-blue-100 transition-colors px-6 py-3 rounded-full font-medium"
              >
                Browse Recipes
              </Link>
              <Link 
                href="/brand/pringles" 
                className="bg-transparent border-2 border-white hover:bg-white/10 transition-colors px-6 py-3 rounded-full font-medium"
              >
                Popular Brands
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/recipes/${recipe.slug}`} className="text-blue-600 hover:underline">
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Brand: <Link href={`/brand/${recipe.brandSlug}`} className="text-blue-500 hover:underline">
                      {recipe.brand}
                    </Link>
                  </p>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  <Link 
                    href={`/recipes/${recipe.slug}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category, index) => (
              <Link 
                key={index} 
                href={`/category/${category.slug}`}
                className="block bg-gray-100 hover:bg-gray-200 transition-colors p-6 rounded-lg text-center"
              >
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Brands</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {featuredBrands.map((brand, index) => (
              <Link 
                key={index} 
                href={`/brand/${brand.slug}`}
                className="block bg-white hover:bg-blue-50 transition-colors p-4 rounded-lg border border-gray-200 min-w-[150px] text-center"
              >
                <h3 className="text-lg font-semibold">{brand.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">About KnockoffKitchen</h2>
          <p className="text-lg mb-6">
            KnockoffKitchen is your source for recreating famous brand-name foods at home. 
            Our copycat recipes let you enjoy your favorite snacks and treats with healthier 
            ingredients, at a fraction of the cost.
          </p>
          <p className="text-lg">
            Browse our collection of recipes by brand or category, and start cooking today!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="mb-4">© 2025 KnockoffKitchen. All rights reserved.</p>
            <div className="flex justify-center gap-6">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/category/chips" className="hover:underline">Categories</Link>
              <Link href="/brand/pringles" className="hover:underline">Brands</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Generate metadata for SEO
export function generateMetadata() {
  return {
    title: 'KnockoffKitchen - Copycat Recipes for Your Favorite Foods',
    description: 'Make your favorite brand-name foods at home with our copycat recipes. Save money and enjoy healthier versions of popular snacks, treats, and meals.',
    keywords: ['copycat recipes', 'homemade', 'DIY food', 'recipe clones', 'knockoff recipes'],
  };
}
