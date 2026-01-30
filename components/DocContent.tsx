import React, { Children, isValidElement, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocPage } from '../data/docs';
import type { DocFrontmatter } from '@/lib/content/loaders';

const CALLOUT_REGEX = /^\s*\[!(\w+)\]\s*([\s\S]*)$/;
const CALLOUT_TYPES = ['info', 'note', 'tip', 'warning', 'danger', 'example', 'quote'];

/** 应用块类型 → 标题前显示的 emoji，可在此修改 */
const CALLOUT_EMOJI: Record<string, string> = {
  info: 'ℹ️',
  note: '📝',
  tip: '💡',
  warning: '⚠️',
  danger: '🚨',
  example: '📌',
  quote: '💬',
};

function getTextFromNode(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(getTextFromNode).join('');
  if (isValidElement(node) && node.props?.children != null) {
    return getTextFromNode(node.props.children);
  }
  return '';
}

function blockquoteToCallout(children: ReactNode): { type: string; title: string; body: ReactNode } | null {
  const arr = Children.toArray(children);
  const fullText = getTextFromNode(children).trim();

  let match: RegExpMatchArray | null = null;
  let first: ReactNode = arr[0];
  let firstIndex = 0;
  let matchedOnFull = false;

  for (let i = 0; i < arr.length; i++) {
    const text = getTextFromNode(arr[i]).trim();
    match = text.match(CALLOUT_REGEX);
    if (match) {
      first = arr[i];
      firstIndex = i;
      break;
    }
  }
  if (!match && fullText.match(CALLOUT_REGEX)) {
    match = fullText.match(CALLOUT_REGEX);
    first = arr[0];
    firstIndex = 0;
    matchedOnFull = true;
  }
  if (!match) return null;

  const [, typeRaw, titlePart] = match;
  const type = CALLOUT_TYPES.includes(typeRaw.toLowerCase()) ? typeRaw.toLowerCase() : 'note';
  const lines = (titlePart ?? '').trim().split(/\n/);
  const titleLine = lines[0]?.trim() || type;
  const title = titleLine;

  const rest = arr.slice(firstIndex + 1);
  const firstText = getTextFromNode(first).trim();
  const firstStripped = firstText.replace(CALLOUT_REGEX, '').trim();

  let body: ReactNode;
  const bodyFromTitlePart = lines.length > 1 ? lines.slice(1).join('\n').trim() : '';
  if (matchedOnFull && bodyFromTitlePart) {
    body = <p className="typo-p">{bodyFromTitlePart}</p>;
  } else if (firstStripped === '' && bodyFromTitlePart) {
    body = <p className="typo-p">{bodyFromTitlePart}</p>;
  } else if (firstStripped) {
    body = (
      <>
        {isValidElement(first) && first.type === 'p' ? (
          <p className="typo-p">{firstStripped}</p>
        ) : (
          firstStripped
        )}
        {rest}
      </>
    );
  } else {
    body = <>{rest}</>;
  }
  return { type, title, body };
}

export default function DocContent({
  page,
  hidden,
  docMeta,
}: {
  page: DocPage;
  hidden: boolean;
  docMeta?: DocFrontmatter;
}) {
  const hasMeta = docMeta && (docMeta.status != null || docMeta.last_updated != null);
  return (
    <article id={page.id} className={`doc ${hidden ? 'doc--hidden' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="typo-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="typo-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="typo-h3" {...props} />,
          p: ({ node, ...props }) => <p className="typo-p" {...props} />,
          ul: ({ node, ...props }) => <ul className="typo-ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="typo-ol" {...props} />,
          li: ({ node, ...props }) => <li className="typo-li" {...props} />,
          blockquote: ({ node, children }) => {
            const callout = blockquoteToCallout(children);
            if (callout) {
              const emoji = CALLOUT_EMOJI[callout.type] ?? CALLOUT_EMOJI.note;
              return (
                <div
                  className={`doc-callout doc-callout--${callout.type}`}
                  role="note"
                >
                  <span className="doc-callout__title">
                    <span className="doc-callout__icon" aria-hidden>{emoji}</span>
                    {callout.title}
                  </span>
                  <div className="doc-callout__body">{callout.body}</div>
                </div>
              );
            }
            return (
              <blockquote className="doc-quote">
                {children}
              </blockquote>
            );
          },
          table: ({ node, ...props }) => (
            <div className="doc-table-wrap">
              <table className="doc-table" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="doc-table__head" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="doc-table__body" {...props} />,
          tr: ({ node, ...props }) => <tr className="doc-table__row" {...props} />,
          th: ({ node, ...props }) => <th className="doc-table__cell doc-table__cell--head" {...props} />,
          td: ({ node, ...props }) => <td className="doc-table__cell" {...props} />,
          hr: ({ node, ...props }) => <hr className="doc-hr" {...props} />,
          code: ({ className, children, ...props }) => {
            const isInline = !className
          
            return isInline ? (
              <code className="token-inline" {...props}>
                {children}
              </code>
            ) : (
              <code className={`token-block ${className}`} {...props}>
                {children}
              </code>
            )
          },
          
        }}
      >
        {page.markdown}
      </ReactMarkdown>
      {hasMeta && (docMeta!.status != null || docMeta!.last_updated != null) && (
        <footer className="doc-status">
          {docMeta!.status != null && (
            <span className="doc-status__value">
              {docMeta!.status.charAt(0).toUpperCase() + docMeta!.status.slice(1).toLowerCase()}
            </span>
          )}
          {docMeta!.last_updated != null && (
            <span className="doc-status__value">{docMeta!.last_updated}</span>
          )}
        </footer>
      )}
    </article>
  );
}
