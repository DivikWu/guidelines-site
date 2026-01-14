'use client';

interface RadiusItem {
  name: string;
  token: string;
  value: string;
}

interface RadiusScaleProps {
  items: RadiusItem[];
}

export default function RadiusScale({ items }: RadiusScaleProps) {
  return (
    <div className="radius-scale">
      {items.map((item, index) => (
        <div key={index} className="radius-scale__item">
          <div className="radius-scale__preview">
            <div
              className="radius-scale__shape"
              style={{
                borderRadius: item.value,
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--primary, var(--yami-color-brand-primary))'
              }}
            />
          </div>
          <div className="radius-scale__details">
            <div className="radius-scale__name">{item.name}</div>
            <div className="radius-scale__token">{item.token}</div>
            <div className="radius-scale__value">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
