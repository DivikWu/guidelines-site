/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  // GitHub Pages 部署：设置 basePath 为仓库名称
  // 这样所有资源路径（包括 CSS 中的字体路径）都会自动加上 basePath 前缀
  basePath: process.env.NODE_ENV === 'production' ? '/guidelines-site' : '',
  // 确保静态资源正确输出
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
