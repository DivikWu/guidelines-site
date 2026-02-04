'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { COMPONENT_PREVIEW_REGISTRY, hasPreviewType } from './component-preview-registry';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';

import type { ComponentType } from 'react';
import type { BasePreviewProps } from './types';

const dynamicCache: Record<string, ComponentType<BasePreviewProps>> = {};

function getLazyPreview(type: string) {
  if (!dynamicCache[type] && hasPreviewType(type)) {
    dynamicCache[type] = dynamic(COMPONENT_PREVIEW_REGISTRY[type], {
      ssr: false,
      loading: () => (
        <div className="doc-preview doc-preview--loading" aria-label="组件预览加载中">
          <span className="doc-preview__loading-text">加载中…</span>
        </div>
      ),

    }) as ComponentType<BasePreviewProps>;
  }
  return dynamicCache[type];
}

interface ComponentPreviewSlotProps {
  previewType: string;
  tableData?: string;
}

export default function ComponentPreviewSlot({ previewType, tableData }: ComponentPreviewSlotProps) {
  const LazyPreview = useMemo(() => getLazyPreview(previewType), [previewType]);

  if (!hasPreviewType(previewType)) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="doc-preview doc-preview--unknown" role="status">
          <span className="doc-preview__error-text">Preview type &quot;{previewType}&quot; not found</span>
        </div>
      );
    }
    return null;
  }

  if (!LazyPreview) return null;

  return (
    <PreviewErrorBoundary>
      <section
        className="doc-preview-wrapper"
        role="region"
        aria-label="组件示例"
      >
        <LazyPreview {...{ tableData }} />
      </section>
    </PreviewErrorBoundary>
  );
}
