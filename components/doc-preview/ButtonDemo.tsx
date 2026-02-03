'use client';

import { BUTTON_TYPES } from './button-demo-code';

interface ButtonDemoProps {
  buttonType: string;
  platform?: 'web' | 'mobile';
}

const TAB_LABEL_BY_TYPE = Object.fromEntries(BUTTON_TYPES.map((t) => [t.id, t.label]));

export default function ButtonDemo({ buttonType, platform = 'web' }: ButtonDemoProps) {
  const baseClass = 'doc-preview-button';
  const variantClass = `doc-preview-button--${buttonType}`;
  const platformClass = platform === 'mobile' ? 'doc-preview-button--mobile' : '';

  const label =
    TAB_LABEL_BY_TYPE[buttonType] ??
    (buttonType === 'with-icon'
      ? '添加'
      : buttonType === 'icon-only'
        ? ''
        : buttonType === 'loading'
          ? '提交中…'
          : buttonType === 'disabled'
            ? '不可用'
            : buttonType === 'ghost'
              ? '更多'
              : buttonType === 'text'
                ? '链接操作'
                : buttonType === 'danger'
                  ? '删除'
                  : '保存');

  if (buttonType === 'icon-only') {
    return (
      <div className="doc-preview-demo">
        <button
          type="button"
          className={`${baseClass} ${variantClass} ${platformClass} doc-preview-button--icon-only`}
          aria-label="设置"
        >
          <span className="doc-preview-button__icon" aria-hidden>⋯</span>
        </button>
      </div>
    );
  }

  if (buttonType === 'with-icon') {
    return (
      <div className="doc-preview-demo">
        <button
          type="button"
          className={`${baseClass} ${variantClass} ${platformClass}`}
        >
          <span className="doc-preview-button__icon" aria-hidden>+</span>
          <span>{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="doc-preview-demo">
      <button
        type="button"
        className={`${baseClass} ${variantClass} ${platformClass}`}
        disabled={buttonType === 'disabled'}
        aria-busy={buttonType === 'loading'}
      >
        {buttonType === 'loading' ? (
          <>
            <span className="doc-preview-button__spinner" aria-hidden />
            <span>{label}</span>
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
