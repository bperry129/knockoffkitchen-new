"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Papa from 'papaparse';

// Simple password protection
const ADMIN_PASSWORD = "knockoffkitchen123"; // In a real app, this should be stored securely

interface CSVRow {
  productname: string;
  brand: string;
  image_url: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const router = useRouter();

  // Handle password submission
  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Password submitted:", password, "Expected:", ADMIN_PASSWORD);
    
    // Force re-render by setting state even if it's the same value
    if (password === ADMIN_PASSWORD) {
      console.log("Password is correct, authenticating...");
      setIsAuthenticated(true);
      // Add a small delay to ensure state update is processed
      setTimeout(() => {
        console.log("Authentication state:", isAuthenticated);
      }, 100);
    } else {
      alert("Incorrect password");
    }
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  // Parse CSV file
  const parseCSV = () => {
    if (!csvFile) return;

    Papa.parse<CSVRow>(csvFile, {
      header: true,
      complete: (results: Papa.ParseResult<CSVRow>) => {
        // Validate CSV structure
        const data = results.data;
        const isValid = data.every(row => 
          'productname' in row && 
          'brand' in row && 
          'image_url' in row
        );

        if (isValid) {
          setCsvData(data);
        } else {
          alert("CSV file must have columns: productname, brand, image_url");
          setCsvData([]);
        }
      },
      error: (error: Error, file?: Papa.LocalFile) => {
        console.error('CSV parsing error:', error);
        alert("Error parsing CSV file");
      }
    });
  };

  // Upload CSV data to Firebase
  const handleUpload = async () => {
    if (csvData.length === 0) {
      parseCSV();
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const response = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: csvData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload CSV data');
      }

      const result = await response.json();
      setUploadStatus({
        success: true,
        message: `Successfully processed ${result.processed} items`
      });
      setCsvData([]);
      setCsvFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during upload'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
        <Link 
          href="/"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file with columns: productname, brand, image_url
        </p>

        <div className="mb-4">
          <input
            type="file"
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
          disabled={!csvFile || isUploading}
          className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
            !csvFile || isUploading ? 'opacity-70 cursor-not-allowed' : ''
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
