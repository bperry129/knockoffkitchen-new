// Script to upload CSV data to Firebase
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

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

// Function to process CSV file
async function processCSV(filePath) {
  try {
    console.log(`Reading file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Found ${records.length} records in CSV file`);
    
    // Validate records
    const invalidRecords = records.filter(record => 
      !record.productname || !record.brand || !record.image_url
    );
    
    if (invalidRecords.length > 0) {
      console.warn(`Warning: ${invalidRecords.length} records are missing required fields`);
    }
    
    // Upload to Firebase
    console.log('Uploading to Firebase...');
    const productsCollection = collection(db, 'products');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const record of records) {
      try {
        const productData = {
          productName: record.productname,
          brandName: record.brand,
          imageUrl: record.image_url,
          createdAt: serverTimestamp(),
          status: 'pending'
        };
        
        await addDoc(productsCollection, productData);
        successCount++;
        console.log(`Uploaded record ${successCount}: ${record.productname}`);
      } catch (error) {
        errorCount++;
        console.error(`Error uploading record: ${record.productname}`, error);
      }
    }
    
    console.log(`Upload complete. Success: ${successCount}, Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

// Main function
async function main() {
  // Get file path from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Please provide a CSV file path');
    console.log('Usage: node upload-csv.js <path-to-csv-file>');
    process.exit(1);
  }
  
  const filePath = args[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  await processCSV(filePath);
  
  // Wait a bit before exiting to ensure all Firebase operations complete
  setTimeout(() => {
    console.log('Done');
    process.exit(0);
  }, 2000);
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
