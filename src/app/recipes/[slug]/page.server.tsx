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
    
    console.log('Generated static params for recipes:', slugs);
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return an empty array as fallback
    return [];
  }
}

// This is a server component that just exports the generateStaticParams function
// The actual page content is in the client component (page.tsx)
export default function RecipeDetailPageServer() {
  return null;
}
