'use client';

interface SpacingItem {
  name: string;
  token: string;
  value: string;
}

interface SpacingScaleProps {
  items: SpacingItem[];
}

export default function SpacingScale({ items }: SpacingScaleProps) {
  return (
    <div className="spacing-scale">
      {items.map((item, index) => {
        const pixels = parseInt(item.value);
        return (
          <div key={index} className="spacing-scale__item">
            <div className="spacing-scale__preview">
              <div
                className="spacing-scale__bar"
                style={{ width: `${pixels}px`, height: `${pixels}px` }}
              />
            </div>
            <div className="spacing-scale__details">
              <div className="spacing-scale__name">{item.name}</div>
              <div className="spacing-scale__token">{item.token}</div>
              <div className="spacing-scale__value">{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
