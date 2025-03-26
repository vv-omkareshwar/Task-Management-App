/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  
  experimental: {
    optimizeCss: true,
    swcMinify: true, // Enable SWC minifier
  },
  
  images: {
    domains: ['example.com'],
  },
  
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ]
  },
  
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config here
    return config
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))