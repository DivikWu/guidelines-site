'use client';

interface ColorSwatchProps {
  name: string;
  value: string;
  description?: string;
}

export default function ColorSwatch({ name, value, description }: ColorSwatchProps) {
  // 计算对比度以决定文字颜色
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb = hexToRgb(value);
  const luminance = rgb ? getLuminance(rgb.r, rgb.g, rgb.b) : 0;
  const textColor = luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';

  return (
    <div className="color-swatch">
      <div
        className="color-swatch__preview"
        style={{
          backgroundColor: value,
          color: textColor
        }}
      >
        <div className="color-swatch__name">{name}</div>
        <div className="color-swatch__value">{value}</div>
      </div>
      {description && <div className="color-swatch__description">{description}</div>}
    </div>
  );
}
