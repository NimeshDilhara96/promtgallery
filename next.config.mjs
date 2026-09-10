/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: [
        'aiprompts.mommentx.space',
        'www.aiprompts.mommentx.space',
        '*.mommentx.space',
        'localhost:3000',
        '*.vercel.app',
      ],
      allowedForwardedHosts: [
        'aiprompts.mommentx.space',
        'www.aiprompts.mommentx.space',
        '*.mommentx.space',
        '*.vercel.app',
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
