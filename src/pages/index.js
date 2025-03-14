import Link from 'next/link';
import { getAllRecipes, getAllCategories, getAllBrands } from '../lib/api';
import { useState } from 'react';

// Custom styles for gradients and premium look
const styles = {
  heroGradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.25)',
  },
  categoryCard: {
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  categoryCardHover: {
    transform: 'translateY(-15px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
  categoryGradients: [
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  ],
  recipeCard: {
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
  },
  recipeCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)',
  },
  recipeImageGradients: [
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
  ],
  brandCard: {
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.05)',
  },
  brandCardHover: {
    transform: 'translateY(-5px) scale(1.03)',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.1)',
  },
  aboutGradient: {
    background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
    borderRadius: '1rem',
    boxShadow: '0 15px 30px rgba(255, 65, 108, 0.2)',
  },
  sectionHeading: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '2rem',
  },
  sectionHeadingAfter: {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)',
    borderRadius: '2px',
  },
  viewButton: {
    background: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)',
    boxShadow: '0 4px 15px rgba(255, 65, 108, 0.3)',
    transition: 'all 0.3s ease',
  },
  viewButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(255, 65, 108, 0.4)',
  },
};

// Icons for categories
const categoryIcons = {
  chips: "fas fa-cookie-bite",
  cookies: "fas fa-cookie",
  sauces: "fas fa-wine-bottle",
  drinks: "fas fa-glass-martini-alt",
  desserts: "fas fa-ice-cream",
  snacks: "fas fa-candy-cane",
};

export default function Home({ allRecipes, allCategories, allBrands }) {
  // Use the first 3 recipes as featured recipes
  const featuredRecipes = allRecipes?.slice(0, 3) || [];
  
  // State for hover effects
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  
  // Fallback data if API data is not available
  const fallbackCategories = [
    { slug: 'chips', name: 'Chips & Crisps', description: 'Make your favorite store-bought chips and crisps at home with these copycat recipes.' },
    { slug: 'cookies', name: 'Cookies', description: 'Recreate famous cookies with our copycat recipes.' },
    { slug: 'sauces', name: 'Sauces & Dips', description: 'Secret sauce recipes from your favorite restaurants.' },
  ];
  
  const fallbackRecipes = [
    { slug: 'pringles-bbq', title: 'Copycat Pringles BBQ', description: 'Make your own BBQ Pringles at home with this easy recipe.', brand: 'Pringles', brandSlug: 'pringles' },
    { slug: 'oreo-cookies', title: 'Homemade Oreo Cookies', description: 'Classic chocolate sandwich cookies with creamy filling.', brand: 'Nabisco', brandSlug: 'nabisco' },
    { slug: 'chick-fil-a-sauce', title: 'Chick-fil-A Sauce', description: 'The perfect blend of honey mustard, barbecue, and ranch.', brand: 'Chick-fil-A', brandSlug: 'chick-fil-a' },
  ];
  
  const fallbackBrands = [
    { slug: 'pringles', name: 'Pringles' },
    { slug: 'doritos', name: 'Doritos' },
    { slug: 'lays', name: 'Lay\'s' },
    { slug: 'oreo', name: 'Oreo' },
    { slug: 'kfc', name: 'KFC' },
    { slug: 'mcdonalds', name: 'McDonald\'s' },
  ];
  
  // Use API data or fallback data
  const categories = allCategories?.length > 0 ? allCategories : fallbackCategories;
  const recipes = featuredRecipes?.length > 0 ? featuredRecipes : fallbackRecipes;
  const brands = allBrands?.length > 0 ? allBrands : fallbackBrands;
  
  return (
    <main>
      {/* Hero Section */}
      <section style={styles.heroGradient} className="p-8 md:p-12 text-white mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Find Your Favorite <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">Copycat Recipes</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
            Make your favorite brand-name foods at home with our premium copycat recipes. 
            Healthier, fresher, and often tastier than the originals!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/category/chips" 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full font-medium transition duration-300 flex items-center gap-2"
            >
              <i className="fas fa-search"></i>
              <span>Explore Recipes</span>
            </Link>
            <Link 
              href="/popular" 
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-medium transition duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-fire"></i>
              <span>Popular Recipes</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Recipe Categories */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={styles.sectionHeading}>
            Popular Categories
            <span style={styles.sectionHeadingAfter}></span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const isHovered = hoveredCategory === category.slug;
            const iconClass = categoryIcons[category.slug] || "fas fa-utensils";
            
            return (
              <Link 
                href={`/category/${category.slug}`} 
                key={category.slug}
                className="block"
                onMouseEnter={() => setHoveredCategory(category.slug)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div 
                  className="rounded-xl overflow-hidden shadow-lg h-full"
                  style={{
                    ...styles.categoryCard,
                    ...(isHovered ? styles.categoryCardHover : {}),
                    background: styles.categoryGradients[index % styles.categoryGradients.length],
                  }}
                >
                  <div className="h-48 flex items-center justify-center p-6 text-white">
                    <i className={`${iconClass} text-6xl mb-4 transform transition-transform duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}></i>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <i className={iconClass}></i>
                      <span>{category.name}</span>
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center text-indigo-600 font-medium">
                        Explore <i className="fas fa-arrow-right ml-2 transition-transform duration-300 transform ${isHovered ? 'translate-x-2' : ''}"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={styles.sectionHeading}>
            Featured Recipes
            <span style={styles.sectionHeadingAfter}></span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => {
            const isHovered = hoveredRecipe === index;
            
            return (
              <div 
                key={index} 
                className="bg-white"
                style={{
                  ...styles.recipeCard,
                  ...(isHovered ? styles.recipeCardHover : {})
                }}
                onMouseEnter={() => setHoveredRecipe(index)}
                onMouseLeave={() => setHoveredRecipe(null)}
              >
                <div 
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: styles.recipeImageGradients[index % styles.recipeImageGradients.length],
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-utensils text-white text-5xl opacity-20"></i>
                  </div>
                  <span className="text-2xl font-bold text-white relative z-10">{recipe.title}</span>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 shadow-md">
                    <i className="fas fa-heart text-red-500"></i>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">
                      <Link href={`/recipes/${recipe.slug}`} className="text-gray-800 hover:text-red-600 transition-colors">
                        {recipe.title}
                      </Link>
                    </h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <i className="fas fa-star mr-1"></i> Popular
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <i className="fas fa-trademark mr-2"></i>
                    Brand: <Link href={`/brand/${recipe.brandSlug}`} className="text-blue-500 hover:text-blue-700 ml-1">
                      {recipe.brand}
                    </Link>
                  </p>
                  <p className="text-gray-600 mb-6">{recipe.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <i className="fas fa-clock mr-1"></i> 30 min
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <i className="fas fa-signal mr-1"></i> Easy
                      </span>
                    </div>
                    <Link 
                      href={`/recipes/${recipe.slug}`}
                      className="text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      style={{
                        ...styles.viewButton,
                        ...(isHovered ? styles.viewButtonHover : {})
                      }}
                    >
                      <span>View</span>
                      <i className={`fas fa-arrow-right transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`}></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/recipes" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white"
            style={styles.viewButton}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.viewButtonHover)}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = styles.viewButton.boxShadow;
            }}
          >
            View All Recipes <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>
      
      {/* Popular Brands */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={styles.sectionHeading}>
            Popular Brands
            <span style={styles.sectionHeadingAfter}></span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              href={`/brand/${brand.slug}`}
              onMouseEnter={() => setHoveredBrand(brand.slug)}
              onMouseLeave={() => setHoveredBrand(null)}
            >
              <div 
                className="p-6 rounded-xl text-center h-full flex flex-col items-center justify-center"
                style={{
                  ...styles.brandCard,
                  ...(hoveredBrand === brand.slug ? styles.brandCardHover : {})
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg">
                  <i className="fas fa-trademark text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold">{brand.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* About Section */}
      <section style={styles.aboutGradient} className="text-white p-8 md:p-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
              <i className="fas fa-info-circle text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold">About KnockoffKitchen</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg">
              <i className="fas fa-check-circle mr-2"></i>
              KnockoffKitchen is your premium source for recreating famous brand-name foods at home.
            </p>
            <p className="text-lg">
              <i className="fas fa-check-circle mr-2"></i>
              Our copycat recipes let you enjoy your favorite snacks and treats with healthier 
              ingredients, at a fraction of the cost.
            </p>
            <p className="text-lg">
              <i className="fas fa-check-circle mr-2"></i>
              Browse our collection of recipes by brand or category, and start cooking today!
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link 
              href="/about" 
              className="bg-white text-red-600 px-6 py-3 rounded-full font-medium transition duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-info-circle"></i>
              <span>Learn More</span>
            </Link>
            <Link 
              href="/contact" 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full font-medium transition duration-300 flex items-center gap-2"
            >
              <i className="fas fa-envelope"></i>
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-white rounded-xl shadow-xl p-8 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full transform translate-x-1/3 -translate-y-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100 to-red-100 rounded-full transform -translate-x-1/3 translate-y-1/3 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-6">
            <i className="fas fa-envelope text-indigo-600 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to get the latest recipes, tips, and food inspiration delivered straight to your inbox. No spam, just delicious content!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow max-w-md"
            />
            <button 
              className="px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2"
              style={styles.viewButton}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.viewButtonHover)}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = styles.viewButton.boxShadow;
              }}
            >
              <span>Subscribe</span>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getStaticProps() {
  // Try to get data from API, but provide fallbacks if it fails
  let allRecipes = [];
  let allCategories = [];
  let allBrands = [];
  
  try {
    allRecipes = await getAllRecipes();
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
  
  try {
    allCategories = await getAllCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  
  try {
    allBrands = await getAllBrands();
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
  
  return {
    props: {
      allRecipes,
      allCategories,
      allBrands,
    },
    // Revalidate every hour
    revalidate: 3600,
  };
}
