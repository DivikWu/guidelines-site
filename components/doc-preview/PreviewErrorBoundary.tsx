'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/** 预览区块错误边界：单个预览报错时不拖垮整篇文档 */
export class PreviewErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[ComponentPreview]', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="doc-preview doc-preview--error"
            role="alert"
            aria-label="组件预览加载失败"
          >
            <span className="doc-preview__error-text">预览加载失败</span>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
