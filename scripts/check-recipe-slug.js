// Script to check recipe slugs in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkRecipeSlugs() {
  try {
    console.log('Fetching recipes from Firestore...');
    
    const recipesCollection = collection(db, "recipes");
    const recipesSnapshot = await getDocs(recipesCollection);
    
    if (recipesSnapshot.empty) {
      console.log('No recipes found in the database.');
      return;
    }
    
    console.log(`Found ${recipesSnapshot.size} recipes in the database.`);
    
    // Print all recipe slugs
    recipesSnapshot.docs.forEach(doc => {
      const recipe = doc.data();
      console.log(`Recipe ID: ${doc.id}`);
      console.log(`Title: ${recipe.title}`);
      console.log(`Slug: ${recipe.slug}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking recipe slugs:', error);
  }
}

// Run the script
checkRecipeSlugs().then(() => {
  console.log('Done checking recipe slugs.');
  setTimeout(() => process.exit(0), 1000);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
