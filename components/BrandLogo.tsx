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
        justifyContent: 'flex-start',
        gap: 0,
        paddingLeft: 0,
        paddingRight: 0,
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
