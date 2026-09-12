/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    bodySizeLimit: '10mb',
    allowedOrigins: [
      'aiprompts.mommentx.space',
      'www.aiprompts.mommentx.space',
      '*.mommentx.space',
      'localhost:3000',
      '*.vercel.app',
    ],
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
