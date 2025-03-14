"use client";

import { useEffect } from 'react';
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
  // Use useEffect to add vanilla JS functionality
  useEffect(() => {
    // Get DOM elements
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    const errorMessage = document.getElementById('error-message');
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const logoutButton = document.getElementById('logout-button');
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const uploadButton = document.getElementById('upload-button');
    const selectedFileInfo = document.getElementById('selected-file-info');
    const uploadStatus = document.getElementById('upload-status');
    const previewSection = document.getElementById('preview-section');
    const previewTable = document.getElementById('preview-table');
    
    let csvData: CSVRow[] = [];
    
    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Login attempt with password:", passwordInput.value);
        
        if (passwordInput.value === ADMIN_PASSWORD) {
          console.log("Password correct, authenticating...");
          if (loginSection) loginSection.style.display = 'none';
          if (adminSection) adminSection.style.display = 'block';
          if (errorMessage) errorMessage.textContent = '';
        } else {
          console.log("Password incorrect");
          if (errorMessage) errorMessage.textContent = 'Incorrect password. Please try again.';
        }
      });
    }
    
    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        if (loginSection) loginSection.style.display = 'block';
        if (adminSection) adminSection.style.display = 'none';
        if (passwordInput) passwordInput.value = '';
      });
    }
    
    // Handle file selection
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          if (selectedFileInfo) {
            selectedFileInfo.textContent = `Selected file: ${file.name}`;
            selectedFileInfo.parentElement!.style.display = 'block';
          }
          
          // Parse CSV file
          Papa.parse(file, {
            header: true,
            complete: (results: Papa.ParseResult<CSVRow>) => {
              // Validate CSV structure
              const data = results.data as CSVRow[];
              const isValid = data.every(row => 
                'productname' in row && 
                'brand' in row && 
                'image_url' in row
              );
              
              if (isValid) {
                csvData = data;
                updatePreview(csvData);
              } else {
                alert("CSV file must have columns: productname, brand, image_url");
                csvData = [];
                if (previewSection) previewSection.style.display = 'none';
              }
            },
            error: (error: Error) => {
              console.error('CSV parsing error:', error);
              alert("Error parsing CSV file");
            }
          });
        }
      });
    }
    
    // Handle upload button
    if (uploadButton) {
      uploadButton.addEventListener('click', async () => {
        if (csvData.length === 0) {
          alert("Please select a valid CSV file first");
          return;
        }
        
        if (uploadButton) {
          uploadButton.textContent = 'Uploading...';
          uploadButton.setAttribute('disabled', 'true');
        }
        
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
          if (uploadStatus) {
            uploadStatus.textContent = `Successfully processed ${result.processed} items`;
            uploadStatus.className = 'mt-4 p-4 rounded-md bg-green-50 text-green-800';
            uploadStatus.style.display = 'block';
          }
          
          // Reset form
          csvData = [];
          if (fileInput) fileInput.value = '';
          if (selectedFileInfo) selectedFileInfo.parentElement!.style.display = 'none';
          if (previewSection) previewSection.style.display = 'none';
          
        } catch (error) {
          console.error('Upload error:', error);
          if (uploadStatus) {
            uploadStatus.textContent = error instanceof Error ? error.message : 'An error occurred during upload';
            uploadStatus.className = 'mt-4 p-4 rounded-md bg-red-50 text-red-800';
            uploadStatus.style.display = 'block';
          }
        } finally {
          if (uploadButton) {
            uploadButton.textContent = 'Upload and Process CSV';
            uploadButton.removeAttribute('disabled');
          }
        }
      });
    }
    
    // Function to update preview table
    function updatePreview(data: CSVRow[]) {
      if (!previewSection || !previewTable) return;
      
      // Show preview section
      previewSection.style.display = 'block';
      
      // Clear existing rows
      const tbody = previewTable.querySelector('tbody');
      if (tbody) tbody.innerHTML = '';
      
      // Add new rows (up to 5)
      const rowsToShow = data.slice(0, 5);
      rowsToShow.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white divide-y divide-gray-200';
        
        const tdProduct = document.createElement('td');
        tdProduct.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        tdProduct.textContent = row.productname;
        tr.appendChild(tdProduct);
        
        const tdBrand = document.createElement('td');
        tdBrand.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        tdBrand.textContent = row.brand;
        tr.appendChild(tdBrand);
        
        const tdImage = document.createElement('td');
        tdImage.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs';
        tdImage.textContent = row.image_url;
        tr.appendChild(tdImage);
        
        tbody?.appendChild(tr);
      });
      
      // Show total count if more than 5 rows
      const countInfo = document.getElementById('preview-count');
      if (countInfo) {
        if (data.length > 5) {
          countInfo.textContent = `Showing 5 of ${data.length} rows`;
          countInfo.style.display = 'block';
        } else {
          countInfo.style.display = 'none';
        }
      }
    }
  }, []); // Empty dependency array means this runs once on mount
  
  return (
    <>
      {/* Login Section */}
      <div id="login-section" className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        <div id="error-message" className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" style={{ display: 'none' }}></div>
        
        <form id="login-form" className="space-y-4">
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password-input"
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

      {/* Admin Dashboard */}
      <div id="admin-section" className="max-w-4xl mx-auto py-8 px-4" style={{ display: 'none' }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              id="logout-button"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
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
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md" style={{ display: 'none' }}>
            <p id="selected-file-info" className="text-sm text-gray-700"></p>
          </div>

          <button
            id="upload-button"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            Upload and Process CSV
          </button>

          <div id="upload-status" className="mt-4 p-4 rounded-md" style={{ display: 'none' }}></div>
        </div>

        <div id="preview-section" className="bg-white rounded-lg shadow-lg p-6" style={{ display: 'none' }}>
          <h2 className="text-xl font-semibold mb-4">CSV Preview</h2>
          <div className="overflow-x-auto">
            <table id="preview-table" className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Rows will be added dynamically */}
              </tbody>
            </table>
            <p id="preview-count" className="mt-2 text-sm text-gray-500" style={{ display: 'none' }}></p>
          </div>
        </div>
      </div>
    </>
  );
}
