/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output a fully static site into ./out for packaging into the standalone executable
  output: 'export',
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