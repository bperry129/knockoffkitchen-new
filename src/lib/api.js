import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore';

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
  
  // Convert Firestore timestamp to ISO string for JSON serialization
  let createdAtISO = '';
  if (data.createdAt) {
    try {
      // Convert Firestore timestamp to ISO string
      createdAtISO = data.createdAt.toDate().toISOString();
    } catch (error) {
      console.error('Error converting timestamp:', error);
      createdAtISO = new Date().toISOString(); // Fallback to current date
    }
  } else {
    createdAtISO = new Date().toISOString(); // Fallback to current date
  }
  
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
    createdAt: createdAtISO, // Use ISO string instead of Date object
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
    // First, try to get the brand from the brands collection
    const brandRef = doc(db, 'brands', slug);
    const brandDoc = await getDoc(brandRef);
    
    if (brandDoc.exists()) {
      // Serialize the brand data to ensure JSON compatibility
      return serializeBrandData(brandDoc.data());
    }
    
    // If not found in brands collection, try to extract from recipes
    const brands = await extractBrandsFromRecipes();
    
    // Return the brand if found in recipes
    if (brands[slug]) {
      return serializeBrandData(brands[slug]);
    }
    
    // If not found anywhere, create a new brand document based on the slug
    // This ensures we never return null for a brand page
    const brandName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const newBrand = {
      name: brandName,
      slug: slug,
      description: `Copycat recipes for ${brandName} products.`,
      foundedYear: 'N/A',
      headquarters: 'N/A',
      createdAt: new Date().toISOString() // Store as ISO string for JSON compatibility
    };
    
    // Save the new brand to the brands collection
    try {
      // Create a copy for Firestore that uses a Date object
      const brandForFirestore = { ...newBrand };
      brandForFirestore.createdAt = new Date(); // Firestore prefers Date objects
      
      await setDoc(doc(db, 'brands', slug), brandForFirestore);
      console.log(`Created new brand document for ${brandName} (${slug})`);
    } catch (saveError) {
      console.error(`Error saving new brand document for ${slug}:`, saveError);
    }
    
    return newBrand;
  } catch (error) {
    console.error(`Error fetching brand with slug ${slug}:`, error);
    
    // Create a fallback brand as a last resort
    const brandName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      name: brandName,
      slug: slug,
      description: `Copycat recipes for ${brandName} products.`,
      foundedYear: 'N/A',
      headquarters: 'N/A',
      createdAt: new Date().toISOString() // Ensure JSON compatibility
    };
  }
}

// Helper function to serialize brand data for JSON
function serializeBrandData(brand) {
  // Create a new object with all properties from the brand
  const serializedBrand = { ...brand };
  
  // Convert Date objects to ISO strings
  if (serializedBrand.createdAt) {
    if (typeof serializedBrand.createdAt.toDate === 'function') {
      // Firestore timestamp
      serializedBrand.createdAt = serializedBrand.createdAt.toDate().toISOString();
    } else if (serializedBrand.createdAt instanceof Date) {
      // JavaScript Date object
      serializedBrand.createdAt = serializedBrand.createdAt.toISOString();
    } else if (typeof serializedBrand.createdAt === 'object') {
      // Unknown object type, convert to string
      serializedBrand.createdAt = String(serializedBrand.createdAt);
    }
  }
  
  return serializedBrand;
}

// Function to get all brands
export async function getAllBrands() {
  try {
    // First, try to get brands from the brands collection
    const brandsSnapshot = await getDocs(collection(db, 'brands'));
    
    if (!brandsSnapshot.empty) {
      // Serialize each brand to ensure JSON compatibility
      return brandsSnapshot.docs.map(doc => serializeBrandData(doc.data()));
    }
    
    // If no brands found in the brands collection, extract from recipes
    const brands = await extractBrandsFromRecipes();
    const brandsList = Object.values(brands);
    
    if (brandsList.length > 0) {
      // Serialize each brand to ensure JSON compatibility
      return brandsList.map(brand => serializeBrandData(brand));
    }
    
    // If still no brands found, create them from recipes
    console.log('No brands found in database, creating from recipes');
    
    // Get all recipes to extract brand information
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    // Extract unique brands from recipes
    const uniqueBrands = {};
    
    for (const recipeDoc of recipesSnapshot.docs) {
      const recipeData = recipeDoc.data();
      
      if (recipeData.brandName && recipeData.brandSlug) {
        // Use brandSlug as the key to ensure uniqueness
        if (!uniqueBrands[recipeData.brandSlug]) {
          uniqueBrands[recipeData.brandSlug] = {
            name: recipeData.brandName,
            slug: recipeData.brandSlug,
            description: `Copycat recipes for ${recipeData.brandName} products.`,
            foundedYear: 'N/A',
            headquarters: 'N/A',
            createdAt: new Date().toISOString() // Store as ISO string for JSON compatibility
          };
          
          // Save the brand to the brands collection
          try {
            // Create a copy for Firestore that uses a Date object
            const brandForFirestore = { ...uniqueBrands[recipeData.brandSlug] };
            brandForFirestore.createdAt = new Date(); // Firestore prefers Date objects
            
            await setDoc(doc(db, 'brands', recipeData.brandSlug), brandForFirestore);
            console.log(`Created brand: ${recipeData.brandName} (${recipeData.brandSlug})`);
          } catch (error) {
            console.error(`Error creating brand ${recipeData.brandSlug}:`, error);
          }
        }
      }
    }
    
    // Return serialized brands
    return Object.values(uniqueBrands);
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

// Fallback brands for static generation
const fallbackBrands = {
  'pringles': { name: 'Pringles', slug: 'pringles' },
  'doritos': { name: 'Doritos', slug: 'doritos' },
  'lays': { name: 'Lay\'s', slug: 'lays' },
  'oreo': { name: 'Oreo', slug: 'oreo' },
  'kfc': { name: 'KFC', slug: 'kfc' },
  'mcdonalds': { name: 'McDonald\'s', slug: 'mcdonalds' },
  'sweet-baby-rays': { name: 'Sweet Baby Ray\'s', slug: 'sweet-baby-rays' },
  'pace': { name: 'Pace', slug: 'pace' },
  'taco-bell': { name: 'Taco Bell', slug: 'taco-bell' },
  'chick-fil-a': { name: 'Chick-fil-A', slug: 'chick-fil-a' },
  'wendys': { name: 'Wendy\'s', slug: 'wendys' },
  'subway': { name: 'Subway', slug: 'subway' },
  'starbucks': { name: 'Starbucks', slug: 'starbucks' },
  'chipotle': { name: 'Chipotle', slug: 'chipotle' },
  'panera': { name: 'Panera Bread', slug: 'panera' },
  'olive-garden': { name: 'Olive Garden', slug: 'olive-garden' },
  'red-lobster': { name: 'Red Lobster', slug: 'red-lobster' },
  'cheesecake-factory': { name: 'The Cheesecake Factory', slug: 'cheesecake-factory' },
  'applebees': { name: 'Applebee\'s', slug: 'applebees' },
  'chilis': { name: 'Chili\'s', slug: 'chilis' },
  'outback': { name: 'Outback Steakhouse', slug: 'outback' },
  'texas-roadhouse': { name: 'Texas Roadhouse', slug: 'texas-roadhouse' },
  'popeyes': { name: 'Popeyes', slug: 'popeyes' },
  'burger-king': { name: 'Burger King', slug: 'burger-king' },
  'arbys': { name: 'Arby\'s', slug: 'arbys' },
  'dairy-queen': { name: 'Dairy Queen', slug: 'dairy-queen' },
  'five-guys': { name: 'Five Guys', slug: 'five-guys' },
  'in-n-out': { name: 'In-N-Out Burger', slug: 'in-n-out' },
  'shake-shack': { name: 'Shake Shack', slug: 'shake-shack' },
  'white-castle': { name: 'White Castle', slug: 'white-castle' },
  'little-caesars': { name: 'Little Caesars', slug: 'little-caesars' },
  'dominos': { name: 'Domino\'s Pizza', slug: 'dominos' },
  'pizza-hut': { name: 'Pizza Hut', slug: 'pizza-hut' },
  'papa-johns': { name: 'Papa John\'s', slug: 'papa-johns' }
};

// Function to get all brand slugs (for generateStaticParams)
export async function getAllBrandSlugs() {
  try {
    // First, try to get brands from the brands collection
    const brandsSnapshot = await getDocs(collection(db, 'brands'));
    
    if (!brandsSnapshot.empty) {
      return brandsSnapshot.docs.map(doc => ({ slug: doc.id }));
    }
    
    // If no brands found in the brands collection, extract from recipes
    const brands = await extractBrandsFromRecipes();
    const brandSlugs = Object.keys(brands).map(slug => ({ slug }));
    
    if (brandSlugs.length > 0) {
      return brandSlugs;
    }
    
    // If still no brands found, create them from recipes
    console.log('No brands found in database, creating from recipes for static generation');
    
    // Get all recipes to extract brand information
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    // Extract unique brand slugs from recipes
    const uniqueBrandSlugs = new Set();
    
    for (const recipeDoc of recipesSnapshot.docs) {
      const recipeData = recipeDoc.data();
      
      if (recipeData.brandSlug) {
        uniqueBrandSlugs.add(recipeData.brandSlug);
      }
    }
    
    return Array.from(uniqueBrandSlugs).map(slug => ({ slug }));
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
