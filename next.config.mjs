/** @type {import('next').NextConfig} */

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

const nextConfig = {
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

export default nextConfig;
