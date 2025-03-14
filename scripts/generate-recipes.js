// Script to generate recipes for products in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, updateDoc, doc } = require('firebase/firestore');
const axios = require('axios');

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

// DeepSeek API configuration
// We're using environment variables to keep the API key secret
// The API key should be provided when running the script
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'deepseek/deepseek-r1-distill-llama-70b';

// Check if API key is provided
if (!OPENROUTER_API_KEY) {
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

    // Extract the recipe JSON from the response
    const recipe = JSON.parse(response.data.choices[0].message.content);
    console.log(`Recipe generated: ${recipe.title}`);
    
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw error;
  }
}

// Function to save recipe to Firestore
async function saveRecipeToFirestore(recipe, productName, brandName) {
  try {
    // Add metadata for database storage
    const recipeWithMetadata = {
      ...recipe,
      productName,
      brandName,
      createdAt: serverTimestamp(),
      slug: generateSlug(recipe.title),
    };

    // Save recipe to Firestore
    const docRef = await addDoc(collection(db, "recipes"), recipeWithMetadata);
    console.log(`Recipe saved to Firestore with ID: ${docRef.id}`);
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

// Main function
async function main() {
  try {
    await processPendingProducts();
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

// Run the script
main();
