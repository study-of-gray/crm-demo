// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     proxy: true,
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // experimental: {
  //   proxy: true,
  // },
  // ✅ Next.js 16 启用 Proxy 的正确方式
  flags: {
    nextProxy: true,
  },
};

module.exports = nextConfig;
