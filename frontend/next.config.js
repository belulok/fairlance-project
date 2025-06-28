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

  // Aggressive webpack configuration to completely avoid worker issues
  webpack: (config, { webpack }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Fix for RainbowKit build issues
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Ignore the problematic worker file completely using IgnorePlugin
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /HeartbeatWorker\.js$/,
      })
    );

    // Also add it as external
    config.externals.push(/HeartbeatWorker\.js$/);

    // Completely disable minification
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };

    return config;
  },
};

module.exports = nextConfig;