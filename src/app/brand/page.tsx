import React from 'react';
import BrandPlaceholder from './index';

// This is a server component that will be rendered on the server
export default function BrandPage() {
  return <BrandPlaceholder />;
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Brand | KnockoffKitchen',
    description: 'Explore copycat recipes from your favorite brands.',
  };
}
