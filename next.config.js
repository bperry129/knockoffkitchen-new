/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export
  output: 'export',
  // Skip type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip linting during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use trailing slash for consistent path handling
  trailingSlash: true,
  // Unoptimized images for static export
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
