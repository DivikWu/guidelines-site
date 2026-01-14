import './globals.css';
import '../tokens.css';
import '../theme.css';
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
      </head>
      <body>
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
