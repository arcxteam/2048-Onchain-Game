// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // INI BISA DI AKTIFKAN JIKA PAKAI CODESPACE GITHUB LANGSUNG
  // allowedDevOrigins: [
  //  "https://test.greyscope.xyz",
  //  "http://0.0.0.0:3000",
  //  "http://localhost:3000",
  // ],
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
  // swcMinify: true, JIKA NEXT.JS VERSI 15 KEBAWAH
  transpilePackages: [
    '@react-native-async-storage/async-storage',
  ],
};

export default nextConfig;
