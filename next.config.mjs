/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  // GitHub Pages 部署：GitHub Actions 会自动注入 basePath
  // 如果手动设置，需要与 GitHub Actions 的配置一致
  // basePath 会在构建时由 GitHub Actions 自动注入，这里不手动设置
  // 确保静态资源正确输出
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
