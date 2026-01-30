'use client';

import Link from 'next/link';
import { useBasePath } from '@/contexts/BasePathContext';

export default function BrandLogo() {
  const basePath = useBasePath();
  const logoPath = `${basePath}/images/logo-icon.png`;
  
  return (
    <Link
      href="/"
      className="brand-logo"
      aria-label="返回主页"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }}
    >
      <img
        className="brand-logo__img"
        src={logoPath}
        alt="YAMI Logo"
      />
      <i 
        className="iconfont ds-icon-a-ziyuan1 inline-flex align-middle leading-none" 
        aria-hidden="true"
        style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}
      />
    </Link>
  );
}
