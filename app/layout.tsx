// CSS 导入顺序：先导入基础变量，再导入依赖这些变量的样式
import '../styles/tokens.css';
import '../styles/theme.css';
import './globals.css';
import { Fira_Code, Inter } from 'next/font/google';
import Script from 'next/script';
import { BasePathProvider } from '../contexts/BasePathContext';
import { TokenProvider } from '../components/TokenProvider';
import { GlobalShortcutsProvider } from '../contexts/GlobalShortcutsContext';
import { SearchProvider } from '../components/SearchProvider';
import TopLoadingBar from '../components/TopLoadingBar';

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code'
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

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
    <html lang="zh-CN" suppressHydrationWarning data-base-path={basePath} className={`${firaCode.variable} ${inter.variable}`}>
      <head>
        {/* 预加载字体 CSS 文件，确保字体定义及时应用 */}
        <link
          rel="preload"
          href={`${fontBasePath}/icofont.css`}
          as="style"
        />
        {/* 导入字体 CSS */}
        <link rel="stylesheet" href={`${fontBasePath}/icofont.css`} />
      </head>
      <body data-layout="root">
        <TopLoadingBar />
        {/* 首帧防闪：仅设置 data-theme、color-scheme、meta theme-color；critical-dark-vars 与 tokens/globals 一致，后续可从 tokens.json 生成 */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("yami-theme")||"light";var el=document.documentElement;el.dataset.theme=t;el.style.colorScheme=t==="dark"?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}m.content=t==="dark"?"#0A0A0A":"#ffffff";if(t==="dark"){var s=document.createElement("style");s.id="critical-dark-vars";s.textContent='html[data-theme="dark"]{--foreground-primary:#E5E5E5;--foreground-secondary:#CCCCCC;--foreground-tertiary:#B3B3B3;--background-page:#0A0A0A;--background-hero:#0E0E0E;--background-primary:#0A0A0A;--background-secondary:#141414;--fill-secondary:rgba(255,255,255,0.06);--border-subtle:rgba(255,255,255,0.08);--border-normal:rgba(255,255,255,0.12);--divider-normal:rgba(255,255,255,0.12);--divider-section:rgba(255,255,255,0.08);--state-hover:rgba(255,255,255,0.04);--state-selected:rgba(255,255,255,0.08);--state-pressed:rgba(255,255,255,0.12);--state-focus:rgba(255,255,255,0.24);--color-text-primary:#E5E5E5;--color-text-secondary:#CCCCCC;--color-surface:#141414;--color-bg:#0A0A0A;--color-border:#262626;color-scheme:dark}';document.head.appendChild(s)}window.addEventListener("load",function(){document.querySelectorAll('link[rel="stylesheet"]').forEach(function(l){if(l.href&&l.sheet===null)console.warn("CSS load failed:",l.href)})})}catch(e){}})();`,
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
