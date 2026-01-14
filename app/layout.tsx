import './globals.css';
import '../tokens.css';
import '../theme.css';
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
        {/* 预加载字体文件 - Next.js 会自动处理 basePath */}
        <link
          rel="preload"
          href="/guidelines-site/fonts/icofont/icofont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <FontDebugger />
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
