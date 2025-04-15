import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['pixabay.com'],
  },
  experimental: {
    allowedDevOrigins: ['*.csb.app'],
  } as unknown as NextConfig['experimental'],
};

export default nextConfig;
