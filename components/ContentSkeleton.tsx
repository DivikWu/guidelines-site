'use client';

export type ContentSkeletonVariant = 'doc' | 'list';

const BODY_LINE_COUNT = 5;
const LIST_ITEMS = 3;
const LINES_PER_LIST_ITEM = 2;

export default function ContentSkeleton({ variant = 'doc' }: { variant?: ContentSkeletonVariant }) {
  return (
    <div className="page-skeleton" aria-busy="true" aria-live="polite">
      {/* H1 标题占位 */}
      <div className="page-skeleton__title" />
      <div className="page-skeleton__body">
        {/* H2 标题占位 */}
        <div className="page-skeleton__subtitle" />
        {Array.from({ length: BODY_LINE_COUNT }, (_, i) => (
          <div
            key={i}
            className={`page-skeleton__line${i === BODY_LINE_COUNT - 1 ? ' page-skeleton__line--last' : ''}`}
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
