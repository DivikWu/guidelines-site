'use client';

import { useCallback, useMemo, useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface DocComponentPreviewProps {
  /** 第一行 Tab（如按钮类型） */
  tabsTop: TabItem[];
  activeTop: string;
  onTopChange: (id: string) => void;
  /** 第二行 Tab（如平台 Web/Mobile） */
  tabsBottom: TabItem[];
  activeBottom: string;
  onBottomChange: (id: string) => void;
  /** 预览区内容 */
  children: React.ReactNode;
  /** 当前应展示的代码（已按平台选好） */
  code: string;
}

export default function DocComponentPreview({
  tabsTop,
  activeTop,
  onTopChange,
  tabsBottom,
  activeBottom,
  onBottomChange,
  children,
  code,
}: DocComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  const lines = useMemo(() => code.split(/\r?\n/), [code]);

  return (
    <div className="doc-preview">
      {/* 上方 Tab：类型 / 平台 */}
      <div className="doc-preview__tabs-outside">
        <div className="doc-preview__tabs doc-preview__tabs--top" role="tablist" aria-label="按钮类型">
          {tabsTop.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTop === tab.id}
              aria-controls="doc-preview-panel"
              id={`doc-preview-tab-top-${tab.id}`}
              className={`doc-preview__tab ${activeTop === tab.id ? 'doc-preview__tab--active' : ''}`}
              onClick={() => onTopChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="doc-preview__block">
        {/* 预览区 header：左侧标题 + 右侧平台 Tab */}
        <div className="doc-preview__block-header">
          <span className="doc-preview__block-title">Preview</span>
          <div className="doc-preview__header-tabs" role="tablist" aria-label="平台">
            {tabsBottom.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeBottom === tab.id}
                aria-controls="doc-preview-panel"
                id={`doc-preview-tab-bottom-${tab.id}`}
                className={`doc-preview__header-tab ${activeBottom === tab.id ? 'doc-preview__header-tab--active' : ''}`}
                onClick={() => onBottomChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* 预览区 + 代码区（文档内一块） */}
        <div
          id="doc-preview-panel"
          className="doc-preview__area"
          role="tabpanel"
          aria-labelledby={`doc-preview-tab-top-${activeTop} doc-preview-tab-bottom-${activeBottom}`}
        >
          {children}
        </div>
        {/* 代码区：默认高度 100px，点击「查看全部」展开 */}
        <div
          className={`doc-preview__code-wrap ${codeExpanded ? 'doc-preview__code-wrap--expanded' : 'doc-preview__code-wrap--collapsed'}`}
          aria-expanded={codeExpanded}
          aria-label="代码：对应当前按钮类型的样式与交互效果"
        >
          <p className="doc-preview__code-caption" aria-hidden>
            以下代码对应当前所选按钮类型的样式与交互效果
          </p>
          <div className="doc-preview__code-inner">
            <div className="doc-preview__line-nums" aria-hidden>
              {lines.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre className="doc-preview__code">
              <code>{code}</code>
            </pre>
          </div>
          <div className="doc-preview__code-actions">
            <button
              type="button"
              className="doc-preview__view-code"
              onClick={() => setCodeExpanded((e) => !e)}
              aria-label={codeExpanded ? '收起代码' : '查看全部代码'}
            >
              {codeExpanded ? '收起' : '查看全部'}
            </button>
            {codeExpanded && (
              <button
                type="button"
                className="doc-preview__copy-btn"
                onClick={handleCopy}
                aria-label={copied ? '已复制' : '复制代码'}
              >
                {copied ? '已复制' : '复制'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
