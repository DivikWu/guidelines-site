/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGithubPages ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : ''

// 仅在对静态站点构建时使用 output: export；本地 dev 不导出，文档路由可随 content/ 动态渲染，同步后无需重启
const nextConfig = {
  ...(isGithubPages ? { output: 'export' } : {}),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: { unoptimized: true },
}

export default nextConfig
