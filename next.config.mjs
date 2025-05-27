/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_API_URL_DEVELOPMENT:
      process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT,
    NEXT_PUBLIC_API_URL_TEST: process.env.NEXT_PUBLIC_API_URL_TEST,
    NEXT_PUBLIC_API_URL_PRODUCTION: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
  },
  output: "standalone",
};

export default nextConfig;
