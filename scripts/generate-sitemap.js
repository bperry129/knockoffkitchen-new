// Script to generate a dynamic sitemap based on the actual recipes in the database
const fs = require('fs');
const path = require('path');
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

// Base URL for the website
const BASE_URL = 'https://knockoffkitchen-new.netlify.app';

// Main function to generate sitemap
async function generateSitemap() {
  console.log('Generating sitemap...');
  
  // Start XML content
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/recipes/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/categories/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/brands/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms/</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy/</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Recipe Pages -->`;

  try {
    // Get all recipes from Firestore
    const recipesSnapshot = await getDocs(collection(db, "recipes"));
    
    // Add each recipe to the sitemap
    recipesSnapshot.forEach((doc) => {
      const recipeData = doc.data();
      if (recipeData.slug) {
        xmlContent += `
  <url>
    <loc>${BASE_URL}/recipes/${recipeData.slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });
    
    // Get all brands from Firestore
    const brandsSnapshot = await getDocs(collection(db, "brands"));
    
    // Add brand header
    xmlContent += `
  
  <!-- Brand Pages -->`;
    
    // Add each brand to the sitemap
    brandsSnapshot.forEach((doc) => {
      const brandData = doc.data();
      if (brandData.slug) {
        xmlContent += `
  <url>
    <loc>${BASE_URL}/brand/${brandData.slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });
    
    // Close XML content
    xmlContent += `
</urlset>`;
    
    // Write to file
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xmlContent);
    
    console.log(`Sitemap generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the function
generateSitemap();
