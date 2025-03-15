// Script to generate recipes for products in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, updateDoc, doc } = require('firebase/firestore');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

// OpenRouter API configuration
// We're using environment variables to keep the API key secret
// The API key should be provided when running the script
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Using a smaller DeepSeek model for cost efficiency
const MODEL = 'deepseek/deepseek-r1-distill-llama-8b';

// Check if API key is provided, but only if we're generating recipes
// Skip this check if we're just updating categories
if (!OPENROUTER_API_KEY && require.main === module) {
  console.error('Error: OPENROUTER_API_KEY environment variable is required');
  console.error('Run the script with: OPENROUTER_API_KEY=your_key node scripts/generate-recipes.js');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to generate a URL-friendly slug from the recipe title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim(); // Trim leading/trailing spaces or hyphens
}

// Function to generate a recipe using DeepSeek
async function generateRecipe(productName, brandName) {
  console.log(`Generating recipe for ${productName} by ${brandName}...`);
  
  const deepSeekPrompt = `
Generate a homemade copycat recipe for ${productName} by ${brandName}. This should closely replicate the original product using common household ingredients while allowing for customization and improved nutritional value.

### **Recipe Title:**
- The title should be catchy and contain relevant SEO keywords.
- Example: "Homemade Heinz Tomato Ketchup: A Copycat Recipe Better Than Store-Bought." Please be unique with every recipe you generate.

### **Introduction (SEO-Optimized)**
- Introduce the product and its history.
- Explain why people love it and why they might want to make it at home.
- Mention benefits of a homemade version (healthier, customizable, cost-effective).
- Include a **personal anecdote** or a **story** to make it engaging.

### **Recipe Details**
Provide the following metadata in a structured format:
- **Prep Time:** X minutes
- **Cook Time:** X minutes
- **Total Time:** X minutes
- **Yield:** X servings

### **Ingredients**
Provide a **detailed ingredient list** in both **US and metric measurements**, maintaining accuracy and proportions.
- Separate into different categories if applicable (e.g., dry vs. wet ingredients).
- Ensure measurements match what would be needed to mimic the store-bought product.

### **Instructions**
Step-by-step cooking instructions that:
1. Explain all necessary steps clearly.
2. Include cooking techniques and timing.
3. Specify the **ideal texture, consistency, and flavor development**.
4. Provide troubleshooting tips (e.g., what to do if it's too thick or too runny).

### **Storage Instructions**
- Explain how long the product lasts in the fridge, freezer, or pantry.
- Include preservation techniques for long-term storage.

### **Recipe Variations & Customization**
- Provide **alternative versions**, such as:
  - A **low-sugar or healthy version**.
  - A **spicy version**.
  - A **smoky version**.
  - Any relevant tweaks for dietary restrictions (e.g., vegan, gluten-free).

### **Special Equipment**
- List tools required (e.g., blender, saucepan, whisk).
- Mention any optional tools that can improve results.

### **Pro Tips**
Provide **3 expert-level cooking tips** to perfect the recipe.

### **Nutritional Comparison**
Create a **comparison table** between the homemade and store-bought version. Include:
- Calories
- Fat
- Sugar
- Sodium
- Protein
- Fiber
- Vitamins & minerals (if relevant)

### **Common Questions & Troubleshooting**
Include an **FAQ section** with 5-7 questions, such as:
- "Can I use fresh ingredients instead of processed ones?"
- "What can I do if the recipe turns out too sweet/salty?"
- "How do I make it last longer?"
- "Can I scale the recipe for large batches?"

### **Serving Suggestions**
List creative ways to use the homemade product, such as:
- Traditional uses (e.g., "Perfect as a dip for fries and burgers").
- Unique applications (e.g., "Use it as a marinade for BBQ ribs").

### **Cost Comparison**
Compare **homemade vs. store-bought cost per serving**:
- List approximate costs for each ingredient.
- Calculate total cost for a full batch.
- Show how much users can save by making it at home.

### **Conclusion**
- Summarize why this recipe is worth making.
- Encourage readers to share their results or leave a review.

Format the response as a JSON object with the following structure:
{
  "title": "Catchy SEO-optimized title",
  "introduction": "SEO-optimized introduction with personal anecdote",
  "recipeDetails": {
    "prepTime": "X minutes",
    "cookTime": "X minutes",
    "totalTime": "X minutes",
    "yield": "X servings"
  },
  "ingredients": {
    "us": ["1 cup flour", "1 tsp salt"],
    "metric": ["120g flour", "5g salt"]
  },
  "instructions": ["Step 1...", "Step 2..."],
  "storageInstructions": "Storage details here",
  "variations": {
    "healthy": "Low-sugar version details",
    "spicy": "Spicy version details",
    "dietary": "Gluten-free/vegan adaptations"
  },
  "equipment": ["blender", "saucepan"],
  "proTips": ["Tip 1", "Tip 2", "Tip 3"],
  "nutritionalComparison": {
    "homemade": {
      "calories": "X per serving",
      "fat": "X g",
      "sugar": "X g"
    },
    "storeBought": {
      "calories": "X per serving",
      "fat": "X g",
      "sugar": "X g"
    }
  },
  "faq": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"}
  ],
  "servingSuggestions": ["Suggestion 1", "Suggestion 2"],
  "costComparison": {
    "homemade": "X per serving",
    "storeBought": "Y per serving",
    "savings": "Z%"
  },
  "conclusion": "Concluding thoughts",
  "category": "Auto-categorized food type (e.g., chips, cookies, sauces)"
}
  `;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are a professional chef and food blogger who specializes in creating copycat recipes of popular brand-name foods. You provide detailed, SEO-optimized recipes with comprehensive information. You always respond with valid JSON that follows the requested structure exactly."
          },
          { role: "user", content: deepSeekPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://knockoffkitchen-new.netlify.app",
          "X-Title": "KnockoffKitchen Recipe Generator"
        }
      }
    );

    // Log the raw response for debugging
    console.log('Raw API response received');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Check if the response has the expected structure
    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message || !response.data.choices[0].message.content) {
      console.error('Unexpected API response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid API response structure');
    }
    
    const content = response.data.choices[0].message.content;
    console.log('Response content:', content);
    
    // Extract the recipe JSON from the response
    // Handle case where the API returns a markdown code block
    let jsonContent = content;
    if (content.startsWith('```json')) {
      jsonContent = content.replace(/```json\n|\n```/g, '');
    }
    
    // Fix any missing commas in the JSON
    jsonContent = jsonContent.replace(/"\n\s+"/g, '",\n  "');
    jsonContent = jsonContent.replace(/}\n\s+{/g, '},\n  {');
    
    console.log('Cleaned JSON content:', jsonContent);
    
    const recipe = JSON.parse(jsonContent);
    console.log(`Recipe generated: ${recipe.title}`);
    
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error.message);
    
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('API response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error instanceof SyntaxError) {
      console.error('JSON parsing error. The API response was not valid JSON.');
      console.error('This could be due to rate limiting or an issue with the API.');
      console.error('Try again later or check your API key permissions.');
    }
    
    throw error;
  }
}

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

// Function to save recipe to Firestore
async function saveRecipeToFirestore(recipe, productName, brandName) {
  try {
    // Generate slug from recipe title
    const slug = generateSlug(recipe.title);
    
    // Get the product data to get the imageUrl
    const productsQuery = query(collection(db, "products"), 
      where("productName", "==", productName), 
      where("brandName", "==", brandName),
      where("status", "==", "pending")
    );
    const productsSnapshot = await getDocs(productsQuery);
    
    let imageUrl = '';
    if (!productsSnapshot.empty) {
      imageUrl = productsSnapshot.docs[0].data().imageUrl || '';
      console.log('Found image URL from product:', imageUrl);
    }
    
    // Standardize the category
    const standardizedCategory = standardizeCategory(recipe.category);
    console.log(`Standardized category: "${recipe.category}" -> "${standardizedCategory}"`);
    
    // Generate brand slug
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Add metadata for database storage
    const recipeWithMetadata = {
      ...recipe,
      category: standardizedCategory, // Use the standardized category
      productName,
      brandName,
      brandSlug, // Add the brand slug
      createdAt: serverTimestamp(),
      slug,
      imageUrl,
    };

    // Save recipe to Firestore
    const docRef = await addDoc(collection(db, "recipes"), recipeWithMetadata);
    console.log(`Recipe saved to Firestore with ID: ${docRef.id}`);
    
    // Update the generateStaticParams.ts file with the new slug
    updateStaticParams(slug);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving recipe to Firestore:', error);
    throw error;
  }
}

// Function to update product status in Firestore
async function updateProductStatus(productId, recipeId) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      status: 'completed',
      recipeId: recipeId
    });
    console.log(`Product ${productId} status updated to 'completed'`);
  } catch (error) {
    console.error(`Error updating product ${productId} status:`, error);
  }
}

// Function to log the new recipe slug (no longer updating generateStaticParams.ts)
function updateStaticParams(slug) {
  // We're no longer updating the generateStaticParams.ts file
  // Instead, we're using Netlify redirects to handle dynamic routes
  console.log(`Generated new recipe with slug: ${slug}`);
}

// Main function to process pending products
async function processPendingProducts() {
  try {
    console.log('Fetching pending products from Firestore...');
    
    // Query for products with status 'pending'
    const productsQuery = query(collection(db, "products"), where("status", "==", "pending"));
    const productsSnapshot = await getDocs(productsQuery);
    
    if (productsSnapshot.empty) {
      console.log('No pending products found.');
      return;
    }
    
    console.log(`Found ${productsSnapshot.size} pending products.`);
    
    // Process each pending product
    for (const productDoc of productsSnapshot.docs) {
      const product = productDoc.data();
      const productId = productDoc.id;
      
      console.log(`Processing product: ${product.productName} by ${product.brandName} (ID: ${productId})`);
      
      try {
        // Generate recipe
        const recipe = await generateRecipe(product.productName, product.brandName);
        
        // Save recipe to Firestore
        const recipeId = await saveRecipeToFirestore(recipe, product.productName, product.brandName);
        
        // Update product status
        await updateProductStatus(productId, recipeId);
        
        console.log(`Successfully processed product ${productId}`);
      } catch (error) {
        console.error(`Error processing product ${productId}:`, error);
        // Continue with next product
      }
    }
    
    console.log('Finished processing pending products.');
  } catch (error) {
    console.error('Error processing pending products:', error);
  }
}

// Function to run the auto-deploy script
async function runAutoDeploy() {
  try {
    console.log('Running auto-deploy script...');
    const { fork } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const autoDeployProcess = fork(path.join(__dirname, 'auto-deploy.js'));
      
      autoDeployProcess.on('exit', (code) => {
        if (code === 0) {
          console.log('Auto-deploy completed successfully.');
          resolve();
        } else {
          console.error(`Auto-deploy failed with code ${code}.`);
          reject(new Error(`Auto-deploy failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('Error running auto-deploy script:', error);
  }
}

// Main function
async function main() {
  try {
    // Process pending products
    await processPendingProducts();
    
    // Run auto-deploy to push changes to GitHub
    await runAutoDeploy();
  } catch (error) {
    console.error('Unhandled error:', error);
  } finally {
    console.log('Script execution completed.');
    // Wait a bit before exiting to ensure all Firebase operations complete
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  }
}

// Export functions for external use
module.exports = {
  updateExistingRecipeCategories,
  main
};

// Run the script if executed directly
if (require.main === module) {
  main();
}
