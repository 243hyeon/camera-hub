import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // 프로젝트 루트 경로 추적 설정 (상위 폴더의 lockfile 간섭 방지)
  outputFileTracingRoot: '.',
};

export default nextConfig;
