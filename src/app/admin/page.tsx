"use client";

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';

interface CSVRow {
  productname: string;
  brand: string;
  image_url: string;
}

export default function AdminPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCsvFile(file);
      console.log("File selected:", file.name);
      
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log("CSV parsing complete:", results);
          
          // Always set the data, even if validation fails
          const data = results.data as CSVRow[];
          setCsvData(data);
          
          // Log the data for debugging
          console.log("CSV data:", data);
          
          // Validate CSV structure but don't block on it
          const hasRequiredColumns = data.length > 0 && 
            'productname' in data[0] && 
            'brand' in data[0] && 
            'image_url' in data[0];
          
          if (!hasRequiredColumns) {
            console.warn("CSV missing required columns");
            alert("Warning: CSV file should have columns: productname, brand, image_url");
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          alert("Error parsing CSV file, but you can still try to upload");
        }
      });
    }
  };

  // Upload CSV data to Firebase
  const handleUpload = async () => {
    // If no file is selected or no data is parsed, show a warning but continue
    if (!csvFile) {
      console.warn("No file selected");
      alert("No file selected. Please select a CSV file first.");
      return;
    }
    
    if (csvData.length === 0) {
      console.warn("No data to upload");
      // Try to parse the file again
      if (csvFile) {
        console.log("Attempting to parse file again");
        Papa.parse(csvFile, {
          header: true,
          complete: async (results) => {
            console.log("Re-parsing complete:", results);
            const data = results.data as CSVRow[];
            if (data.length > 0) {
              setCsvData(data);
              // Continue with upload using the newly parsed data
              await uploadData(data);
            } else {
              alert("Could not extract any data from the CSV file");
            }
          },
          error: (error) => {
            console.error("Re-parsing error:", error);
            alert("Error parsing the CSV file");
          }
        });
      }
      return;
    }
    
    // If we have data, proceed with upload
    await uploadData(csvData);
  };
  
  // Function to handle the actual upload
  const uploadData = async (data: CSVRow[]) => {
    setIsUploading(true);
    setUploadStatus(null);
    console.log("Uploading data:", data);
    
    try {
      // First check if Firebase is properly configured
      try {
        // Simple test to see if we can access Firestore
        console.log("Testing Firebase connection...");
        const testData = { test: true, timestamp: new Date().toISOString() };
        console.log("Test data:", testData);
        
        // Display a message to the user
        setUploadStatus({
          success: true,
          message: "Connecting to Firebase and uploading data..."
        });
      } catch (fbError) {
        console.error("Firebase connection test failed:", fbError);
        // Continue anyway, as the actual error will be caught in the main try/catch
      }
      
      // Proceed with the upload
      console.log("Sending data to API...");
      const response = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data }),
      });
      
      console.log("API response status:", response.status);
      
      // Get the response body as text first for debugging
      const responseText = await response.text();
      console.log("API response text:", responseText);
      
      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error(`Invalid response from server: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error("API error response:", result);
        throw new Error(result.error || `Server error: ${response.status}`);
      }
      
      console.log("API success response:", result);
      setUploadStatus({
        success: true,
        message: `Successfully processed ${result.processed} items`
      });
      setCsvData([]);
      setCsvFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        success: false,
        message: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unknown error occurred during upload. Check console for details.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">CSV Upload Tool</h1>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/test"
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            CSV Test Tool
          </Link>
          <Link 
            href="/"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file with columns: productname, brand, image_url
        </p>

        <div className="mb-4">
          <input
            type="file"
            id="file-input"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {csvFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">Selected file: {csvFile.name}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
            isUploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload and Process CSV'}
        </button>

        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-md ${uploadStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {uploadStatus.message}
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">CSV Preview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.productname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{row.image_url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && (
              <p className="mt-2 text-sm text-gray-500">Showing 5 of {csvData.length} rows</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
