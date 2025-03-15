const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, setDoc, doc, getDoc } = require('firebase/firestore');

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

/**
 * This script creates a brands collection based on the brandName and brandSlug fields in the recipes collection.
 * It ensures that all unique brands have a corresponding document in the brands collection.
 */
async function createBrandsCollection() {
  try {
    console.log('Starting brands collection creation process...');
    
    // Get all recipes
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    if (recipesSnapshot.empty) {
      console.log('No recipes found to extract brands from.');
      return;
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
            createdAt: new Date()
          };
        }
      }
    }
    
    console.log(`Found ${Object.keys(uniqueBrands).length} unique brands.`);
    
    // Create or update brand documents in the brands collection
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const [slug, brandData] of Object.entries(uniqueBrands)) {
      try {
        // Check if the brand document already exists
        const brandDocRef = doc(db, 'brands', slug);
        const brandDoc = await getDoc(brandDocRef);
        
        if (brandDoc.exists()) {
          // Update existing brand document
          await setDoc(brandDocRef, brandData, { merge: true });
          console.log(`Updated brand: ${brandData.name} (${slug})`);
          updatedCount++;
        } else {
          // Create new brand document
          await setDoc(brandDocRef, brandData);
          console.log(`Created brand: ${brandData.name} (${slug})`);
          createdCount++;
        }
      } catch (error) {
        console.error(`Error creating/updating brand ${slug}:`, error);
      }
    }
    
    console.log(`Brands collection creation complete. Created: ${createdCount}, Updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error in brands collection creation process:', error);
  }
}

// Run the creation function
createBrandsCollection()
  .then(() => {
    console.log('Brands collection creation script completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Brands collection creation script failed:', error);
    process.exit(1);
  });
