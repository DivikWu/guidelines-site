'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 客户端重定向到 /docs/...（静态导出下 next.config redirects 不生效时使用）
 */
export default function RedirectToDocs({ path }: { path: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(path);
  }, [router, path]);
  return null;
}
