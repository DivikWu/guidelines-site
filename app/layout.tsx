// CSS 导入顺序：先导入基础变量，再导入依赖这些变量的样式
import '../styles/tokens.css';
import '../styles/theme.css';
import './globals.css';
import Script from 'next/script';
import { BasePathProvider } from '../contexts/BasePathContext';
import { TokenProvider } from '../components/TokenProvider';
import { GlobalShortcutsProvider } from '../contexts/GlobalShortcutsContext';
import { SearchProvider } from '../components/SearchProvider';
import TopLoadingBar from '../components/TopLoadingBar';

export const metadata = {
  title: 'YAMI Design Guidelines | 设计规范',
  description: 'YAMI UX/UI Design Guidelines'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // 在构建时确定 basePath（与 next.config.mjs 逻辑保持一致）
  const isGithubPagesBuild =
    process.env.GITHUB_PAGES === 'true' && process.env.NODE_ENV === 'production';
  const basePath = isGithubPagesBuild ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';
  const fontBasePath = `${basePath}/fonts/icofont`;
  
  return (
    <html lang="zh-CN" suppressHydrationWarning data-base-path={basePath}>
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
      <body data-layout="root">
        <TopLoadingBar />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("yami-theme")||"light";document.documentElement.dataset.theme=t}catch(e){}})();`,
          }}
        />
        <BasePathProvider basePath={basePath}>
          <TokenProvider>
            <GlobalShortcutsProvider>
              <SearchProvider>{children}</SearchProvider>
            </GlobalShortcutsProvider>
          </TokenProvider>
        </BasePathProvider>
      </body>
    </html>
  );
}
