"use client";

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';

interface CSVRow {
  productname: string;
  brand: string;
  image_url: string;
}

export default function TestPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [parseStatus, setParseStatus] = useState<string>('');

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCsvFile(file);
      setParseStatus(`File selected: ${file.name}`);
      
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setParseStatus(prev => `${prev}\nParsing complete. Found ${results.data.length} rows.`);
          
          // Always set the data, even if validation fails
          const data = results.data as CSVRow[];
          setCsvData(data);
          
          // Log the data for debugging
          console.log("CSV data:", data);
          
          // Validate CSV structure but don't block on it
          if (data.length > 0) {
            setParseStatus(prev => `${prev}\nFirst row keys: ${Object.keys(data[0]).join(', ')}`);
            
            const hasRequiredColumns = 
              'productname' in data[0] && 
              'brand' in data[0] && 
              'image_url' in data[0];
            
            if (hasRequiredColumns) {
              setParseStatus(prev => `${prev}\nValidation: All required columns found.`);
            } else {
              setParseStatus(prev => `${prev}\nValidation: Missing required columns.`);
            }
          } else {
            setParseStatus(prev => `${prev}\nNo data rows found in CSV.`);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setParseStatus(prev => `${prev}\nError parsing CSV: ${error.message}`);
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">CSV Test Tool</h1>
        <Link 
          href="/admin"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test CSV Parsing</h2>
        <p className="text-gray-600 mb-4">
          This page only tests CSV parsing without uploading to Firebase.
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

        {parseStatus && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{parseStatus}</pre>
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">CSV Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.productname || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.brand || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{row.image_url || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-500">Total rows: {csvData.length}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Raw Data (First Row)</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
              {csvData.length > 0 ? JSON.stringify(csvData[0], null, 2) : 'No data'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
