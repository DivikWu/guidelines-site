/** @type {import('next').NextConfig} */

import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// 注意：Next dev 与 next build 都会写入 distDir。
// 如果同时运行 dev + build，会导致 dev 的 /_next/static 资源 404（CSS/JS “像默认样式”）。
// 解决：为 dev 使用独立的 distDir，避免被 build 覆盖。
export default function nextConfig(phase) {
  // Only enable basePath/assetPrefix for GitHub Pages builds.
  // Local dev should NOT have a basePath or static export output.
  const isGithubPages = process.env.GITHUB_PAGES === 'true';

  // Change this to your GitHub repo name (the part after github.com/<user>/)
  const repoName = 'guidelines-site';

  const basePath = isGithubPages ? `/${repoName}` : '';

  // 设置环境变量，供组件使用
  if (isGithubPages) {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }

  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    // 分离 dev/build 输出目录，避免互相覆盖导致静态资源 404
    distDir: isDev ? '.next-dev' : '.next',

    basePath: basePath,
    assetPrefix: basePath,

    // Static export only for GitHub Pages builds
    ...(isGithubPages ? { output: 'export' } : {}),

    // Next/Image optimization is not available in static export.
    images: {
      unoptimized: true,
    },

    // Optional: keep trailing slash off (GitHub Pages works either way)
    // trailingSlash: true,
  };
}
