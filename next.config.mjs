/** @type {import('next').NextConfig} */
// 仅在 NODE_ENV === 'production' 且 GITHUB_PAGES === 'true' 时为 true，避免 dev 误启用 output: 'export' 导致本地 404
const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true' && process.env.NODE_ENV === 'production'
const basePath = isGithubPagesBuild ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : ''

// 仅在对静态站点构建时使用 output: export；本地 dev 不导出，文档路由可随 content/ 动态渲染，同步后无需重启
const nextConfig = {
  ...(isGithubPagesBuild ? { output: 'export' } : {}),
  basePath,
  // GitHub Pages 项目站点的根即 /guidelines-site，assetPrefix 与 basePath 一致
  assetPrefix: basePath ? `${basePath}/` : '',
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['react-markdown', 'remark-gfm'],
  },
}

export default nextConfig
