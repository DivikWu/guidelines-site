interface IconProps {
  name: string;
  className?: string;
  title?: string;
  size?: number; // 图标大小（px），默认 20
}

export default function Icon({ name, className = '', title, size = 20 }: IconProps) {
  // 默认样式：inline-flex 确保对齐，align-middle 垂直居中，leading-none 避免行高影响
  const defaultClassName = 'inline-flex align-middle leading-none';
  const iconClassName = `iconfont ${name} ${defaultClassName} ${className}`.trim();
  
  return (
    <i
      className={iconClassName}
      style={{ fontSize: `${size}px` }}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? 'false' : 'true'}
    />
  );
}
