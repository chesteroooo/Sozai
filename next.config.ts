import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 釘住專案根目錄，避免 Next 因家目錄殘留的 package-lock.json 推斷出錯誤的 workspace root。
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
