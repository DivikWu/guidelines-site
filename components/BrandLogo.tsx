'use client';

export default function BrandLogo() {
  // 获取 basePath（用于 GitHub Pages）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // 深色模式和浅色模式使用同一张图片
  const logoPath = `${basePath}/images/logo-icon.png`;
  
  return (
    <div
      className="brand-logo"
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
    </div>
  );
}
