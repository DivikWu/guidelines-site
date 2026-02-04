import type { ComponentType } from 'react';

/**
 * 组件预览注册表：type -> 动态加载函数。
 * 仅当文档中出现对应指令时才加载该 chunk，避免主 bundle 包含所有预览组件。
 */
export const COMPONENT_PREVIEW_REGISTRY: Record<
  string,
  () => Promise<{ default: ComponentType<any> }>
> = {
  button: () => import('./ButtonPreviewSection').then((m) => ({ default: m.default })),
  'color-palette': () => import('./ColorPalette').then((m) => ({ default: m.default })),
};

export function getPreviewTypes(): string[] {
  return Object.keys(COMPONENT_PREVIEW_REGISTRY);
}

export function hasPreviewType(type: string): boolean {
  return type in COMPONENT_PREVIEW_REGISTRY;
}
