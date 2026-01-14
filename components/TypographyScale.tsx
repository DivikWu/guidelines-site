'use client';

interface TypographyItem {
  name: string;
  token: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
}

interface TypographyScaleProps {
  items: TypographyItem[];
}

export default function TypographyScale({ items }: TypographyScaleProps) {
  return (
    <div className="typography-scale">
      {items.map((item, index) => (
        <div key={index} className="typography-scale__item">
          <div className="typography-scale__preview" style={{
            fontSize: item.fontSize,
            lineHeight: item.lineHeight,
            fontWeight: item.fontWeight
          }}>
            {item.name}
          </div>
          <div className="typography-scale__details">
            <div className="typography-scale__token">{item.token}</div>
            <div className="typography-scale__specs">
              {item.fontSize} / {item.lineHeight} / {item.fontWeight}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
