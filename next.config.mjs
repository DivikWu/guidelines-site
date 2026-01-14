/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  // GitHub Pages 部署：设置 basePath 和 assetPrefix 为仓库名称
  // basePath 处理路由和 HTML 中的路径
  // assetPrefix 处理静态资源（包括 CSS 中的字体路径）
  basePath: process.env.NODE_ENV === 'production' ? '/guidelines-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/guidelines-site' : '',
  // 确保静态资源正确输出
  output: 'export',
  images: {
    unoptimized: true
  }
};

// #region agent log
import fs from 'fs';
const logPath = '/Users/divikwu/Documents/Code/yds/.cursor/debug.log';
try {
  fs.appendFileSync(logPath, JSON.stringify({
    location: 'next.config.mjs',
    message: 'Next.js config loaded',
    data: {
      basePath: nextConfig.basePath,
      output: nextConfig.output,
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production'
    },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'D'
  }) + '\n');
} catch (e) {
  // Log file will be created automatically
}
// #endregion

export default nextConfig;
