import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// This function is needed for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    // Initialize Firebase and get all recipes
    const recipesQuery = query(collection(db, "recipes"));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    // Map the recipes to their slugs
    const slugs = recipesSnapshot.docs.map(doc => ({
      slug: doc.data().slug || doc.id,
    }));
    
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return an empty array as fallback
    return [];
  }
}
