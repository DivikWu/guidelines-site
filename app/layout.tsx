// CSS 导入顺序：先导入基础变量，再导入依赖这些变量的样式
import '../styles/tokens.css';
import '../styles/theme.css';
import './globals.css';
import { TokenProvider } from '../components/TokenProvider';
import FontDebugger from '../components/FontDebugger';

export const metadata = {
  title: 'YAMI Design Guidelines | 设计规范',
  description: 'YAMI UX/UI Design Guidelines'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预加载字体文件，提升加载性能 */}
        <link
          rel="preload"
          href="/fonts/icofont/icofont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* 导入字体 CSS */}
        <link rel="stylesheet" href="/fonts/icofont/icofont.css" />
      </head>
      <body>
        <FontDebugger />
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
