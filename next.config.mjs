// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://10.0.11.161:3000",
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "react-native": false,
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "buffer": "buffer/",
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": "@react-native-async-storage/async-storage",
    };

    return config;
  },
  // swcMinify: true,
  transpilePackages: [
    '@web3auth/modal',
    '@web3auth/base',
    '@web3auth/ui',
    '@react-native-async-storage/async-storage',
  ],
};

export default nextConfig;