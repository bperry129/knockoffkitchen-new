import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { data } = await req.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid data format. Expected non-empty array.'
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate each row has the required fields
    const invalidRows = data.filter(row => 
      !row.productname || !row.brand || !row.image_url
    );

    if (invalidRows.length > 0) {
      return new Response(JSON.stringify({ 
        error: `${invalidRows.length} rows are missing required fields.`
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Process each row and save to Firestore
    const processedCount = await processCSVData(data);

    return new Response(JSON.stringify({ 
      success: true,
      processed: processedCount
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process CSV data',
      details: error.response?.data || 'No additional details available'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Process CSV data and save to Firestore
async function processCSVData(data) {
  let processedCount = 0;
  let errors = [];

  try {
    console.log("Checking Firestore connection...");
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firestore database is not initialized");
    }

    // Try to access the products collection
    const productsCollection = collection(db, 'products');
    console.log("Products collection reference created");

    // Create a batch of promises to add documents
    const promises = data.map(async (row, index) => {
      try {
        // Format the data for Firestore
        const productData = {
          productName: row.productname,
          brandName: row.brand,
          imageUrl: row.image_url,
          createdAt: serverTimestamp(),
          status: 'pending', // Status for tracking which products need recipes generated
        };

        console.log(`Adding document for row ${index}:`, productData);
        
        // Add document to 'products' collection
        await addDoc(productsCollection, productData);
        console.log(`Document added for row ${index}`);
        processedCount++;
      } catch (error) {
        console.error(`Error processing row ${index}: ${JSON.stringify(row)}`, error);
        errors.push({
          row: index,
          error: error.message || 'Unknown error',
          data: row
        });
        // Continue processing other rows even if one fails
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    
    // If we had errors but some rows were processed, return the count
    if (errors.length > 0) {
      console.warn(`Processed ${processedCount} rows with ${errors.length} errors`);
      // If all rows failed, throw an error
      if (processedCount === 0) {
        throw new Error(`Failed to process any rows. First error: ${errors[0].error}`);
      }
    }
    
    return processedCount;
  } catch (error) {
    console.error("Error in processCSVData:", error);
    // If it's a Firebase-specific error, provide more context
    if (error.code && error.code.startsWith('firestore/')) {
      throw new Error(`Firebase error: ${error.code} - ${error.message}. Please check your Firebase configuration and ensure the database is set up.`);
    }
    throw error;
  }
}
