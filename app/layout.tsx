// CSS 导入顺序：先导入基础变量，再导入依赖这些变量的样式
import '../styles/tokens.css';
import '../styles/theme.css';
import './globals.css';
import { TokenProvider } from '../components/TokenProvider';

export const metadata = {
  title: 'YAMI Design Guidelines | 设计规范',
  description: 'YAMI UX/UI Design Guidelines'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // 在构建时确定 basePath（从环境变量读取，由 next.config.mjs 设置）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fontBasePath = `${basePath}/fonts/icofont`;
  
  return (
    <html lang="zh-CN">
      <head>
        {/* 预加载字体 CSS 文件，确保字体定义及时应用 */}
        <link
          rel="preload"
          href={`${fontBasePath}/icofont.css`}
          as="style"
        />
        {/* 预加载字体文件，提升加载性能 */}
        <link
          rel="preload"
          href={`${fontBasePath}/icofont.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* 导入字体 CSS */}
        <link rel="stylesheet" href={`${fontBasePath}/icofont.css`} />
      </head>
      <body>
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
