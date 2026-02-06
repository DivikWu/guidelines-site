'use client';

import React, { useMemo, useState, useEffect } from 'react';
import tokensData from '../../tokens/tokens.json';
import type { ColorPaletteProps } from './types';

/**
 * ColorPalette Component
 * Renders a visual matrix of design tokens.
 * Can use data from tokens.json or from a Markdown table passed via tableData prop.
 */

// 标准色阶
const DEFAULT_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

interface ColorFamily {
    id: string;
    name: string;
    shades: Record<string, string>;
}

/**
 * Swatch Component
 * Handles individual color cell Interaction and copy.
 */
function Swatch({ value, title }: { value: string; title: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div
            className="color-palette-matrix__swatch"
            style={{ backgroundColor: value }}
            title={title}
            onClick={handleCopy}
        >
            <div className="color-palette-matrix__tooltip">
                <span>{copied ? 'Copied!' : value}</span>
            </div>
        </div>
    );
}

/**
 * 解析 Markdown 表格数据
... (parseTableData function remains the same, assuming it was defined before)
*/
function parseTableData(tableData: string): ColorFamily[] {
    try {
        const lines = tableData.trim().split('\n');
        if (lines.length < 3) {
            console.warn('[ColorPalette] 表格数据行数不足,至少需要 3 行(表头、分隔符、数据)');
            return [];
        }

        // 第一行是表头
        const headerCells = lines[0].split('|').map(c => c.trim()).filter(Boolean);
        if (headerCells.length < 2) {
            console.warn('[ColorPalette] 表格表头列数不足');
            return [];
        }

        // 判断表格格式
        const firstHeader = headerCells[0].toLowerCase();
        const isStepInFirstColumn = firstHeader.includes('阶梯') || firstHeader.includes('step');

        if (isStepInFirstColumn) {
            // 格式: | 阶梯 | Red | Yellow | ... |
            const colorNames = headerCells.slice(1);
            const families: ColorFamily[] = colorNames.map(name => ({
                id: name.toLowerCase(),
                name,
                shades: {}
            }));

            // 从第三行开始是数据行
            for (let i = 2; i < lines.length; i++) {
                const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
                if (cells.length < 2) continue;

                // 第一列是步进值,提取数字部分
                const stepText = cells[0].replace(/\*\*/g, '').replace(/`/g, '').trim();
                const step = stepText.split('/')[0]; // 处理 "950/1000" 这样的情况

                // 后续列是各个色系的值
                for (let j = 0; j < colorNames.length && j + 1 < cells.length; j++) {
                    const value = cells[j + 1].replace(/`/g, '').trim();
                    // 支持 Hex (#RRGGBB) 和 RGBA (rgba(r, g, b, a)) 格式
                    if (value && (value.match(/^#[0-9A-Fa-f]{6}$/) || value.match(/^rgba?\(/))) {
                        families[j].shades[step] = value;
                    }
                }
            }

            return families;
        } else {
            // 格式: | 色系 | 50 | 100 | ... |
            const steps = headerCells.slice(1);
            const families: ColorFamily[] = [];

            for (let i = 2; i < lines.length; i++) {
                const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
                if (cells.length < 2) continue;

                const name = cells[0];
                const shades: Record<string, string> = {};

                for (let j = 0; j < steps.length && j + 1 < cells.length; j++) {
                    const step = steps[j];
                    const value = cells[j + 1].replace(/`/g, '').trim();
                    // 支持 Hex (#RRGGBB) 和 RGBA (rgba(r, g, b, a)) 格式
                    if (value && (value.match(/^#[0-9A-Fa-f]{6}$/) || value.match(/^rgba?\(/))) {
                        shades[step] = value;
                    }
                }

                families.push({
                    id: name.toLowerCase(),
                    name,
                    shades
                });
            }

            return families;
        }
    } catch (error) {
        console.error('[ColorPalette] 表格解析失败:', error);
        return [];
    }
}

/**
 * 从 tokens.json 获取默认色彩数据
 */
function getDefaultFamilies(): ColorFamily[] {
    const palette = (tokensData as any).color?.palette || {};
    return [
        { id: 'red', name: 'Red', shades: {} },
        { id: 'yellow', name: 'Yellow', shades: {} },
        { id: 'emerald', name: 'Green', shades: {} },
        { id: 'blue', name: 'Blue', shades: {} },
        { id: 'purple', name: 'Purple', shades: {} }
    ].map(f => ({
        ...f,
        shades: Object.fromEntries(
            DEFAULT_STEPS.map(step => [step, palette[f.id]?.[step]?.value]).filter(([_, v]) => v)
        )
    }));
}

export default function ColorPalette({ tableData }: ColorPaletteProps) {
    // 使用 useMemo 缓存解析结果,避免不必要的重新计算
    const familiesToShow = useMemo(() => {
        if (tableData) {
            const parsed = parseTableData(tableData);
            // 如果解析失败或结果为空,降级到 tokens.json
            if (parsed.length === 0) {
                console.warn('[ColorPalette] 表格解析结果为空,使用 tokens.json 数据');
                return getDefaultFamilies();
            }
            return parsed;
        }
        return getDefaultFamilies();
    }, [tableData]);

    // 如果没有任何数据,显示错误提示
    if (familiesToShow.length === 0) {
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="color-palette-matrix" style={{ padding: '20px', color: 'red' }}>
                    ⚠️ 无法加载色彩数据,请检查 tableData 或 tokens.json
                </div>
            );
        }
        return null;
    }

    // 检测是否包含 White Alpha,为整个容器添加深色背景
    const hasWhiteAlpha = familiesToShow.some(f =>
        f.name.toLowerCase().includes('white') && f.name.toLowerCase().includes('alpha')
    );

    return (
        <div className={`color-palette-matrix ${hasWhiteAlpha ? 'color-palette-matrix--dark-container' : ''}`}>
            <div className="color-palette-matrix__grid">
                {/* Header Row */}
                <div className="color-palette-matrix__row color-palette-matrix__row--header">
                    <div className="color-palette-matrix__label color-palette-matrix__label--corner"></div>
                    {DEFAULT_STEPS.map((step) => (
                        <div key={step} className="color-palette-matrix__step-label">
                            {step}
                        </div>
                    ))}
                </div>

                {/* Color Rows */}
                {familiesToShow.map((f) => {
                    // 为 White Alpha 添加深色背景
                    const isDarkBg = f.name.toLowerCase().includes('white') && f.name.toLowerCase().includes('alpha');
                    return (
                        <div key={f.id} className={`color-palette-matrix__row ${isDarkBg ? 'color-palette-matrix__row--dark-bg' : ''}`}>
                            <div className="color-palette-matrix__label">{f.name}</div>
                            {DEFAULT_STEPS.map((step) => {
                                const value = f.shades[step];
                                return (
                                    <div key={step} className="color-palette-matrix__cell">
                                        {value ? (
                                            <Swatch
                                                value={value}
                                                title={`${f.name} ${step}: ${value}`}
                                            />
                                        ) : (
                                            <div className="color-palette-matrix__swatch color-palette-matrix__swatch--empty" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
