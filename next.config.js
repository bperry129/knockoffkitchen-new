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
  trailingSlash: true,
  // Make sure CSS is properly included in the build
  optimizeFonts: false,
  // Ensure assets are referenced correctly
  assetPrefix: '',
  basePath: '',
};

module.exports = nextConfig;
