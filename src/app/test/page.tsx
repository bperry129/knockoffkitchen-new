import React from 'react';

export default function TestPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-gray-600 mb-8">This is a simple test page to verify deployment.</p>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Test Page | KnockoffKitchen',
    description: 'A simple test page to verify deployment.',
  };
}
