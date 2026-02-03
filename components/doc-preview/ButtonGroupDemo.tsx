'use client';

/**
 * 按钮组预览：严格按参考图，横向一排 ← | Archive | Report | Snooze | …
 * 左1、右5 为圆形/大圆角；中间三钮视觉相连、竖线分隔。
 */
export default function ButtonGroupDemo() {
  return (
    <div className="doc-preview-demo doc-preview-button-group">
      <button
        type="button"
        className="doc-preview-button-group__item doc-preview-button-group__item--round"
        aria-label="返回"
      >
        <span aria-hidden>←</span>
      </button>
      <div className="doc-preview-button-group__middle">
        <button type="button" className="doc-preview-button-group__item doc-preview-button-group__item--text">
          Archive
        </button>
        <span className="doc-preview-button-group__divider" aria-hidden />
        <button type="button" className="doc-preview-button-group__item doc-preview-button-group__item--text">
          Report
        </button>
        <span className="doc-preview-button-group__divider" aria-hidden />
        <button type="button" className="doc-preview-button-group__item doc-preview-button-group__item--text">
          Snooze
        </button>
      </div>
      <button
        type="button"
        className="doc-preview-button-group__item doc-preview-button-group__item--round"
        aria-label="更多"
      >
        <span aria-hidden>…</span>
      </button>
    </div>
  );
}
