// Script to check categories in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query } = require('firebase/firestore');

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

async function checkCategories() {
  try {
    console.log('Fetching recipes from Firestore...');
    
    // Query for all recipes
    const recipesQuery = query(collection(db, "recipes"));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      console.log('No recipes found.');
      return;
    }
    
    console.log(`Found ${recipesSnapshot.size} recipes.`);
    
    // Extract and log categories
    const categories = new Map();
    
    recipesSnapshot.docs.forEach(doc => {
      const recipe = doc.data();
      const category = recipe.category || 'Uncategorized';
      
      if (categories.has(category)) {
        categories.set(category, categories.get(category) + 1);
      } else {
        categories.set(category, 1);
      }
      
      console.log(`Recipe: ${recipe.title}, Category: ${category}`);
    });
    
    console.log('\nCategory Summary:');
    categories.forEach((count, category) => {
      console.log(`${category}: ${count} recipes`);
    });
    
  } catch (error) {
    console.error('Error checking categories:', error);
  }
}

// Run the script
checkCategories().then(() => {
  console.log('Script execution completed.');
  // Wait a bit before exiting to ensure all Firebase operations complete
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});
