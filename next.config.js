/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export', // Add this for static site generation, which works better with Netlify
  images: {
    unoptimized: true, // Required when using 'export'
  },
};

module.exports = nextConfig;
