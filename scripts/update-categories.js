// Script to update recipe categories in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, updateDoc, doc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_MyqzpDoT6uCGtwE9q0umJ0DdhNRPaJc",
  authDomain: "knockoffkitchen-ea234.firebaseapp.com",
  projectId: "knockoffkitchen-ea234",
  storageBucket: "knockoffkitchen-ea234.firebasestorage.app",
  messagingSenderId: "406251123459",
  appId: "1:406251123459:web:4489d1e0aa4d0bf63faf36",
  measurementId: "G-0S2PLVWNVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to standardize category names
function standardizeCategory(category) {
  if (!category) return 'Uncategorized';
  
  // Convert to lowercase and trim
  let standardized = category.toLowerCase().trim();
  
  // Map of common categories to their standardized form
  const categoryMap = {
    'sauce': 'Sauces',
    'sauces': 'Sauces',
    'chip': 'Chips',
    'chips': 'Chips',
    'cookie': 'Cookies',
    'cookies': 'Cookies',
    'spread': 'Spreads',
    'spreads': 'Spreads',
    'dip': 'Dips',
    'dips': 'Dips',
    'snack': 'Snacks',
    'snacks': 'Snacks',
    'drink': 'Drinks',
    'drinks': 'Drinks',
    'dessert': 'Desserts',
    'desserts': 'Desserts',
    'condiment': 'Condiments',
    'condiments': 'Condiments',
    'breakfast': 'Breakfast',
    'dinner': 'Dinner',
    'lunch': 'Lunch',
    'candy': 'Candies',
    'candies': 'Candies',
    'chocolate': 'Chocolates',
    'chocolates': 'Chocolates',
    'cereal': 'Cereals',
    'cereals': 'Cereals',
    'bread': 'Breads',
    'breads': 'Breads',
    'pastry': 'Pastries',
    'pastries': 'Pastries',
    'cracker': 'Crackers',
    'crackers': 'Crackers'
  };
  
  // Check if the category is in our map
  for (const [key, value] of Object.entries(categoryMap)) {
    if (standardized.includes(key)) {
      return value; // Already capitalized in the map
    }
  }
  
  // If not found in map, just capitalize the first letter
  return standardized.charAt(0).toUpperCase() + standardized.slice(1);
}

// Function to update existing recipes with standardized categories
async function updateExistingRecipeCategories() {
  try {
    console.log('Updating existing recipe categories...');
    
    // Query for all recipes
    const recipesQuery = query(collection(db, "recipes"));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      console.log('No recipes found to update.');
      return;
    }
    
    console.log(`Found ${recipesSnapshot.size} recipes to check for category updates.`);
    
    // Update each recipe with standardized category
    let updatedCount = 0;
    
    for (const recipeDoc of recipesSnapshot.docs) {
      const recipe = recipeDoc.data();
      const currentCategory = recipe.category || 'Uncategorized';
      const standardizedCategory = standardizeCategory(currentCategory);
      
      // Only update if the category has changed
      if (currentCategory !== standardizedCategory) {
        console.log(`Updating recipe "${recipe.title}" category from "${currentCategory}" to "${standardizedCategory}"`);
        
        const recipeRef = doc(db, "recipes", recipeDoc.id);
        await updateDoc(recipeRef, {
          category: standardizedCategory
        });
        
        updatedCount++;
      }
    }
    
    console.log(`Updated categories for ${updatedCount} recipes.`);
  } catch (error) {
    console.error('Error updating recipe categories:', error);
  }
}

// Run the script
updateExistingRecipeCategories().then(() => {
  console.log('Category update completed.');
  // Wait a bit before exiting to ensure all Firebase operations complete
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});
