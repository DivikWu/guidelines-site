'use client';

import React, { useMemo, useState } from 'react';

interface ShadowToken {
    value: string;
    type: string;
}

interface ShadowData {
    [key: string]: {
        [level: string]: ShadowToken;
    };
}

interface ShadowPreviewProps {
    content: string;
}

/**
 * ShadowPreview Component
 * Renders an interactive gallery for visualizing box-shadow tokens.
 * Features:
 * - Visual shadow boxes
 * - Token name & value display
 * - Responsive grid layout
 * - Dark mode optimized rendering
 */
const ShadowPreview: React.FC<ShadowPreviewProps> = ({ content }) => {
    const [copied, setCopied] = useState<string | null>(null);

    const tokens = useMemo(() => {
        try {
            const data = JSON.parse(content) as ShadowData;
            const result: Array<{ name: string; value: string }> = [];

            // Flatten the nesting (e.g., elevation.100)
            Object.entries(data).forEach(([group, items]) => {
                Object.entries(items).forEach(([level, token]) => {
                    result.push({
                        name: `${group}.${level}`,
                        value: token.value
                    });
                });
            });

            return result;
        } catch (e) {
            console.error('Failed to parse shadow tokens:', e);
            return [];
        }
    }, [content]);

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        setCopied(value);
        setTimeout(() => setCopied(null), 2000);
    };

    if (tokens.length === 0) {
        return (
            <div className="shadow-preview-error">
                <p>Failed to parse shadow tokens. Please check JSON format.</p>
                <pre>{content}</pre>
            </div>
        );
    }

    return (
        <div className="shadow-gallery">
            <div className="shadow-gallery__grid">
                {tokens.map((token) => (
                    <div key={token.name} className="shadow-card">
                        <div className="shadow-card__preview">
                            {/* The box itself with the shadow applied */}
                            <div
                                className="shadow-box"
                                style={{ boxShadow: token.value }}
                                title={token.name}
                            />
                        </div>
                        <div className="shadow-card__info">
                            <span className="shadow-card__name">{token.name}</span>
                            <button
                                className="shadow-card__copy-btn"
                                onClick={() => handleCopy(token.value)}
                                title="Click to copy CSS value"
                            >
                                {copied === token.value ? 'Copied!' : 'Copy Value'}
                            </button>
                        </div>
                        <div className="shadow-card__value">
                            <code>{token.value}</code>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .shadow-gallery {
          margin: 24px 0;
          width: 100%;
        }
        .shadow-gallery__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }
        .shadow-card {
          background: var(--background-primary, #ffffff);
          border: 1px solid var(--border-subtle, rgba(0,0,0,0.06));
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        [data-theme='dark'] .shadow-card {
          background: var(--background-secondary, #141414);
          border-color: rgba(255,255,255,0.08);
        }
        .shadow-card:hover {
          transform: translateY(-2px);
          border-color: var(--brand-primary, #3b82f6);
        }
        .shadow-card__preview {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background-secondary, #f9f9f9);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        [data-theme='dark'] .shadow-card__preview {
          background: #000000;
        }
        .shadow-box {
          width: 60px;
          height: 60px;
          background: var(--background-primary, #ffffff);
          border-radius: 8px;
        }
        [data-theme='dark'] .shadow-box {
          background: #1A1A1A;
          /* In dark mode, pure black shadows are invisible. 
             We can optionally tweak the value here if needed, 
             but we'll stick to the token's value first. */
        }
        .shadow-card__info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .shadow-card__name {
          font-weight: 600;
          font-size: 14px;
          color: var(--foreground-primary, #111);
        }
        .shadow-card__copy-btn {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          background: var(--brand-primary, #3b82f6);
          color: white;
          border: none;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .shadow-card__copy-btn:hover {
          opacity: 1;
        }
        .shadow-card__value {
          font-size: 11px;
          color: var(--foreground-secondary, #666);
          background: var(--background-secondary, #f2f2f2);
          padding: 8px;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        [data-theme='dark'] .shadow-card__value {
          background: rgba(255,255,255,0.04);
          color: #888;
        }
      `}</style>
        </div>
    );
};

export default ShadowPreview;
