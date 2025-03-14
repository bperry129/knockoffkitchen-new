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

  // Create a batch of promises to add documents
  const promises = data.map(async (row) => {
    try {
      // Format the data for Firestore
      const productData = {
        productName: row.productname,
        brandName: row.brand,
        imageUrl: row.image_url,
        createdAt: serverTimestamp(),
        status: 'pending', // Status for tracking which products need recipes generated
      };

      // Add document to 'products' collection
      await addDoc(collection(db, 'products'), productData);
      processedCount++;
    } catch (error) {
      console.error(`Error processing row: ${JSON.stringify(row)}`, error);
      // Continue processing other rows even if one fails
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);
  
  return processedCount;
}
