'use client';

import Link from 'next/link';

export default function BrandLogo() {
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
        textTransform: 'uppercase',
        fontSize: '16px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        textDecoration: 'none',
      }}
    >
      UI/UX Guidelines
    </Link>
  );
}
