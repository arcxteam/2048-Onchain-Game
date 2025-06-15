import { defineNextConfig } from 'next';

const nextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://10.0.10.247:3000", // Sesuaikan dengan alamat Codespace
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "react-native": false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": "@react-native-async-storage/async-storage",
    };
    return config;
  },
};

export default defineNextConfig(nextConfig);