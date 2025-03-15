import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';

// Fallback data for categories if none are found in the database
const fallbackCategories = {
  'chips': {
    name: 'Chips & Crisps',
    slug: 'chips',
    description: 'Make your favorite store-bought chips and crisps at home with these copycat recipes. Healthier, fresher, and often tastier than the originals!'
  },
  'cookies': {
    name: 'Cookies',
    slug: 'cookies',
    description: 'Recreate famous cookies with our copycat recipes.'
  },
  'sauces': {
    name: 'Sauces & Dips',
    slug: 'sauces',
    description: 'Secret sauce recipes from your favorite restaurants.'
  }
};

// Helper function to convert Firestore document to recipe object
function convertRecipeDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    description: data.introduction?.substring(0, 150) + '...' || '',
    brand: data.brandName || '',
    brandSlug: data.brandSlug || '',
    category: data.category || 'Uncategorized',
    categorySlug: data.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'uncategorized',
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt?.toDate() || new Date(),
    // Add other fields as needed
  };
}

// Helper function to extract unique categories from recipes
async function extractCategoriesFromRecipes() {
  const categories = {};
  
  try {
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    recipesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        const categorySlug = data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        if (!categories[categorySlug]) {
          categories[categorySlug] = {
            name: data.category,
            slug: categorySlug,
            description: `Delicious ${data.category.toLowerCase()} recipes you can make at home.`
          };
        }
      }
    });
    
    return categories;
  } catch (error) {
    console.error('Error extracting categories:', error);
    return fallbackCategories;
  }
}

// Helper function to extract unique brands from recipes
async function extractBrandsFromRecipes() {
  const brands = {};
  
  try {
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    recipesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.brandName && data.brandSlug) {
        if (!brands[data.brandSlug]) {
          brands[data.brandSlug] = {
            name: data.brandName,
            slug: data.brandSlug,
            description: `Copycat recipes for ${data.brandName} products.`
          };
        }
      }
    });
    
    return brands;
  } catch (error) {
    console.error('Error extracting brands:', error);
    return {};
  }
}

// Function to get a recipe by slug
export async function getRecipeBySlug(slug) {
  try {
    const recipesQuery = query(collection(db, 'recipes'), where('slug', '==', slug));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      return null;
    }
    
    return convertRecipeDoc(recipesSnapshot.docs[0]);
  } catch (error) {
    console.error(`Error fetching recipe with slug ${slug}:`, error);
    return null;
  }
}

// Function to get all recipes
export async function getAllRecipes() {
  try {
    const recipesQuery = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    return recipesSnapshot.docs.map(convertRecipeDoc);
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    return [];
  }
}

// Function to get recipes by brand
export async function getRecipesByBrand(brandSlug) {
  try {
    const recipesQuery = query(
      collection(db, 'recipes'), 
      where('brandSlug', '==', brandSlug),
      orderBy('createdAt', 'desc')
    );
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    return recipesSnapshot.docs.map(convertRecipeDoc);
  } catch (error) {
    console.error(`Error fetching recipes for brand ${brandSlug}:`, error);
    return [];
  }
}

// Function to get recipes by category
export async function getRecipesByCategory(categorySlug) {
  try {
    // Convert slug to proper category name format (e.g., 'chips' to 'Chips')
    const categories = await extractCategoriesFromRecipes();
    const category = categories[categorySlug]?.name || '';
    
    if (!category) {
      return [];
    }
    
    const recipesQuery = query(
      collection(db, 'recipes'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    return recipesSnapshot.docs.map(convertRecipeDoc);
  } catch (error) {
    console.error(`Error fetching recipes for category ${categorySlug}:`, error);
    return [];
  }
}

// Function to get a brand by slug
export async function getBrandBySlug(slug) {
  try {
    const brands = await extractBrandsFromRecipes();
    return brands[slug] || null;
  } catch (error) {
    console.error(`Error fetching brand with slug ${slug}:`, error);
    return null;
  }
}

// Function to get all brands
export async function getAllBrands() {
  try {
    const brands = await extractBrandsFromRecipes();
    return Object.values(brands);
  } catch (error) {
    console.error('Error fetching all brands:', error);
    return [];
  }
}

// Function to get a category by slug
export async function getCategoryBySlug(slug) {
  try {
    const categories = await extractCategoriesFromRecipes();
    return categories[slug] || null;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
}

// Function to get all categories
export async function getAllCategories() {
  try {
    const categories = await extractCategoriesFromRecipes();
    return Object.values(categories);
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return Object.values(fallbackCategories);
  }
}

// Function to get all recipe slugs (for generateStaticParams)
export async function getAllRecipeSlugs() {
  try {
    const recipesQuery = query(collection(db, 'recipes'));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    return recipesSnapshot.docs
      .map(doc => doc.data().slug)
      .filter(Boolean)
      .map(slug => ({ slug }));
  } catch (error) {
    console.error('Error fetching all recipe slugs:', error);
    return [];
  }
}

// Function to get all brand slugs (for generateStaticParams)
export async function getAllBrandSlugs() {
  try {
    const brands = await extractBrandsFromRecipes();
    return Object.keys(brands).map(slug => ({ slug }));
  } catch (error) {
    console.error('Error fetching all brand slugs:', error);
    return [];
  }
}

// Function to get all category slugs (for generateStaticParams)
export async function getAllCategorySlugs() {
  try {
    const categories = await extractCategoriesFromRecipes();
    return Object.keys(categories).map(slug => ({ slug }));
  } catch (error) {
    console.error('Error fetching all category slugs:', error);
    return Object.keys(fallbackCategories).map(slug => ({ slug }));
  }
}
