/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pixabay.com'],
  },
  experimental: {
    allowedDevOrigins: ['*.csb.app'],
  },
};

module.exports = nextConfig;