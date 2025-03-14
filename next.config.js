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
  // Ensure proper asset paths for Netlify
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Disable font optimization to avoid issues with static export
  optimizeFonts: false,
  // Increase static generation timeout (default is 60 seconds)
  staticPageGenerationTimeout: 180, // 3 minutes
  // Optimize build performance
  swcMinify: true,
  // Reduce the impact of large pages
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Experimental features to improve performance
  experimental: {
    // Improve memory usage
    memoryBasedWorkersCount: true,
  },
};

module.exports = nextConfig;
