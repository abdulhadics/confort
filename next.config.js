/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['hume', '@humeai/voice-react'],
};

module.exports = nextConfig;

