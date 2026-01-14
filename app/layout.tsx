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
      <body>
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
