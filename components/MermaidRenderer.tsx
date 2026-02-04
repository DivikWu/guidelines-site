'use client';

import React, { useEffect, useState, memo } from 'react';
import { renderMermaid, THEMES } from 'beautiful-mermaid';

interface MermaidRendererProps {
    content: string;
}

/**
 * MermaidRenderer component that uses beautiful-mermaid for high-quality SVG rendering.
 * Features:
 * - Async rendering
 * - Theme-aware (Light/Dark)
 * - Sharp SVG output
 */
const MermaidRenderer: React.FC<MermaidRendererProps> = ({ content }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Determine current theme settings
    const getThemeOptions = () => {
        const isDark = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';

        // Using predefined themes from beautiful-mermaid or custom colors
        return isDark
            ? {
                bg: '#0A0A0A',
                fg: '#E5E5E5',
                line: '#404040',
                accent: '#7aa2f7',
                muted: '#B3B3B3',
                surface: '#141414',
                border: '#262626',
                transparent: true
            }
            : {
                bg: '#ffffff',
                fg: '#111111',
                line: '#E5E5E5',
                accent: '#3b82f6',
                muted: '#666666',
                surface: '#F9F9F9',
                border: '#E5E5E5',
                transparent: true
            };
    };

    useEffect(() => {
        setIsMounted(true);

        const render = async () => {
            try {
                const result = await renderMermaid(content, {
                    ...getThemeOptions(),
                    font: 'Inter, system-ui, sans-serif',
                    padding: 20
                });
                setSvg(result);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError(err instanceof Error ? err.message : 'Failed to render diagram');
            }
        };

        render();

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    render();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, [content]);

    if (!isMounted) return <div className="mermaid-placeholder" style={{ minHeight: '100px' }} />;

    if (error) {
        return (
            <div className="mermaid-error" style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                <strong>Mermaid Error:</strong> {error}
                <pre style={{ fontSize: '12px', marginTop: '10px' }}>{content}</pre>
            </div>
        );
    }

    return (
        <div
            className="mermaid-wrapper"
            style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '24px 0',
                overflowX: 'auto',
                width: '100%'
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default memo(MermaidRenderer);
