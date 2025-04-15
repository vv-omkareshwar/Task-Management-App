/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Use SWC for minification instead of Terser for faster builds
  i18n: {
    locales: ['en', 'fr', 'es'], // Define which locales you want to support
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`, // Proxy API requests to backend
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Custom webpack config goes here
    return config
  },
}

export default nextConfig;