/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
  },
};

export default nextConfig;
