'use client';

export type ContentSkeletonVariant = 'doc' | 'list';

const BODY_LINE_COUNT = 5;
const BODY_WIDTHS = ['100%', '96%', '92%', '98%', '94%'];
const LIST_ITEMS = 3;
const LINES_PER_LIST_ITEM = 2;

export default function ContentSkeleton({ variant = 'doc' }: { variant?: ContentSkeletonVariant }) {
  return (
    <div className="page-skeleton" aria-busy="true" aria-live="polite">
      {/* 标题占位：1 行，较宽较高 */}
      <div className="page-skeleton__title" />
      <div className="page-skeleton__body">
        {Array.from({ length: BODY_LINE_COUNT }, (_, i) => (
          <div
            key={i}
            className="page-skeleton__line"
            style={{ width: BODY_WIDTHS[i] ?? '90%' }}
          />
        ))}
      </div>
      {variant === 'list' && (
        <div className="page-skeleton__list">
          {Array.from({ length: LIST_ITEMS }, (_, i) => (
            <div key={i} className="page-skeleton__list-item">
              <div className="page-skeleton__line page-skeleton__line--list-first" />
              <div className="page-skeleton__line page-skeleton__line--list-second" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
