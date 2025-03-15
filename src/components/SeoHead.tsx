"use client";

import { useEffect } from 'react';
import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: string;
  keywords?: string[];
}

export default function SeoHead({
  title,
  description,
  imageUrl = 'https://knockoffkitchen-new.netlify.app/logo.png',
  url = 'https://knockoffkitchen-new.netlify.app',
  type = 'website',
  keywords = ['copycat recipes', 'homemade', 'DIY food', 'recipe clones', 'knockoff recipes'],
}: SeoHeadProps) {
  // Ensure title is not too long for SEO
  const seoTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Ensure description is not too long for SEO
  const seoDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  // Join keywords into a comma-separated string
  const keywordsString = keywords.join(', ');

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Update the document title
    document.title = `${seoTitle} | KnockoffKitchen`;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: keywordsString },
      
      // Open Graph tags
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'KnockoffKitchen' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: imageUrl },
    ];
    
    // Remove existing meta tags
    const existingMetaTags = document.querySelectorAll('meta[data-seo="true"]');
    existingMetaTags.forEach(tag => tag.remove());
    
    // Add new meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      const key = Object.keys(tag)[0];
      const value = tag[key as keyof typeof tag];
      
      if (key && value) {
        meta.setAttribute(key, value);
        meta.setAttribute('data-seo', 'true');
        document.head.appendChild(meta);
      }
    });
  }, [seoTitle, seoDescription, imageUrl, url, type, keywordsString]);

  return null;
}
