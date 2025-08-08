/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/npm/twemoji@14.0.2/assets/**',
      },
    ],
  },
}

module.exports = nextConfig