'use client';

export default function BrandLogo() {
  return (
    <div className="brand-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <i 
        className="iconfont ds-icon-yami_pre inline-flex align-middle leading-none" 
        aria-hidden="true"
        style={{ fontSize: '40px' }}
      />
      <i 
        className="iconfont ds-icon-a-ziyuan1 inline-flex align-middle leading-none" 
        aria-hidden="true"
        style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}
      />
    </div>
  );
}
