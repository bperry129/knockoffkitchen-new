/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use trailing slash for consistent path handling
  trailingSlash: true,
  // Set assetPrefix to relative path for better compatibility with Netlify
  assetPrefix: './',
  // No basePath for simplicity
  basePath: '',
};

module.exports = nextConfig;
