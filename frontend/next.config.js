/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable SWC minifier to avoid RainbowKit issues
  swcMinify: false,

  // Simple webpack configuration to avoid worker issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Fix for RainbowKit build issues
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Completely disable minification for problematic files
    config.optimization = {
      ...config.optimization,
      minimize: false, // Disable minification entirely to avoid worker issues
    };

    return config;
  },
};

module.exports = nextConfig;