"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width = 600,
  height = 400,
  className = '',
  priority = false,
  objectFit = 'cover',
  onError
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(!priority);
  
  // Handle image loading errors
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setImgSrc('https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found');
    if (onError) onError();
  };
  
  // Handle image load success
  const handleLoad = () => {
    setLoading(false);
  };
  
  // Update image source if prop changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading image...</span>
        </div>
      )}
      
      {/* Use Next.js Image component for optimized loading */}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit }}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
      />
    </div>
  );
}
