const { db } = require('../src/lib/firebase');
const { collection, getDocs, updateDoc, doc } = require('firebase/firestore');

/**
 * This script updates recipes with brand information.
 * It ensures that all recipes have a brandName field and updates the brandSlug field.
 */
async function updateBrands() {
  try {
    console.log('Starting brand update process...');
    
    // Get all recipes
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    
    if (recipesSnapshot.empty) {
      console.log('No recipes found to update.');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each recipe
    for (const recipeDoc of recipesSnapshot.docs) {
      const recipeData = recipeDoc.data();
      const recipeId = recipeDoc.id;
      
      // Check if the recipe needs updating
      let needsUpdate = false;
      const updates = {};
      
      // If brandName is missing but brand exists, use brand as brandName
      if (!recipeData.brandName && recipeData.brand) {
        updates.brandName = recipeData.brand;
        needsUpdate = true;
      }
      
      // If brandName exists but brandSlug is missing, create brandSlug
      if (recipeData.brandName && !recipeData.brandSlug) {
        const brandSlug = recipeData.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        updates.brandSlug = brandSlug;
        needsUpdate = true;
      }
      
      // Update the recipe if needed
      if (needsUpdate) {
        try {
          await updateDoc(doc(db, 'recipes', recipeId), updates);
          console.log(`Updated recipe: ${recipeData.title || recipeId}`);
          updatedCount++;
        } catch (error) {
          console.error(`Error updating recipe ${recipeId}:`, error);
        }
      } else {
        skippedCount++;
      }
    }
    
    console.log(`Brand update complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error('Error in brand update process:', error);
  }
}

// Run the update function
updateBrands()
  .then(() => {
    console.log('Brand update script completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Brand update script failed:', error);
    process.exit(1);
  });
