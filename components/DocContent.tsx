'use client';
import React, { Children, isValidElement, memo, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { DocPage } from '../data/docs';
import type { DocMetaForClient } from '@/lib/content/loaders';
import FileTree from './FileTree';
import MermaidRenderer from './MermaidRenderer';

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
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props?.children != null) return getTextFromNode(props.children);
  }
  return '';
}

function isCalloutBodyEmpty(body: ReactNode): boolean {
  return getTextFromNode(body).trim() === '';
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

/** 稳定引用，避免 DocContentBody 因 components 对象变化而无效重渲染；ReactMarkdown 会传入 node */
type MarkdownElProps<T extends keyof React.JSX.IntrinsicElements> = { node?: unknown } & React.ComponentPropsWithoutRef<T>;

const DOC_MARKDOWN_COMPONENTS = {
  h1: ({ node: _n, ...props }: MarkdownElProps<'h1'>) => <h1 className="typo-h1" {...props} />,
  h2: ({ node: _n, ...props }: MarkdownElProps<'h2'>) => <h2 className="typo-h2" {...props} />,
  h3: ({ node: _n, ...props }: MarkdownElProps<'h3'>) => <h3 className="typo-h3" {...props} />,
  h4: ({ node: _n, ...props }: MarkdownElProps<'h4'>) => <h4 className="typo-h4" {...props} />,
  p: ({ node: _n, ...props }: MarkdownElProps<'p'>) => <p className="typo-p" {...props} />,
  ul: ({ node: _n, ...props }: MarkdownElProps<'ul'>) => <ul className="typo-ul" {...props} />,
  ol: ({ node: _n, ...props }: MarkdownElProps<'ol'>) => <ol className="typo-ol" {...props} />,
  li: ({ node: _n, ...props }: MarkdownElProps<'li'>) => <li className="typo-li" {...props} />,
  blockquote: ({ node: _n, children }: { node?: unknown; children?: ReactNode }) => {
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
          {!isCalloutBodyEmpty(callout.body) && (
            <div className="doc-callout__body">{callout.body}</div>
          )}
        </div>
      );
    }
    return (
      <blockquote className="doc-quote">
        {children}
      </blockquote>
    );
  },
  table: ({ node: _n, ...props }: MarkdownElProps<'table'>) => (
    <div className="doc-table-wrap">
      <table className="doc-table" {...props} />
    </div>
  ),
  thead: ({ node: _n, ...props }: MarkdownElProps<'thead'>) => <thead className="doc-table__head" {...props} />,
  tbody: ({ node: _n, ...props }: MarkdownElProps<'tbody'>) => <tbody className="doc-table__body" {...props} />,
  tr: ({ node: _n, ...props }: MarkdownElProps<'tr'>) => <tr className="doc-table__row" {...props} />,
  th: ({ node: _n, ...props }: MarkdownElProps<'th'>) => <th className="doc-table__cell doc-table__cell--head" {...props} />,
  td: ({ node: _n, ...props }: MarkdownElProps<'td'>) => <td className="doc-table__cell" {...props} />,
  hr: ({ node: _n, ...props }: MarkdownElProps<'hr'>) => <hr className="doc-hr" {...props} />,
  a: ({ node: _n, href, children, ...props }: MarkdownElProps<'a'>) => {
    const isInternal =
      href != null &&
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !/^https?:\/\//i.test(href);
    if (isInternal && href) {
      const processedHref =
        !href.endsWith('/') && !/\.[a-z0-9]+$/i.test(href)
          ? `${href}/`
          : href;
      return <Link href={processedHref} {...props}>{children}</Link>;
    }
    return (
      <a
        href={href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ node: _n, className, children, ...props }: { node?: unknown; className?: string; children?: ReactNode }) => {
    const isInline = !className;
    const isFileTree = className === 'language-filetree';
    const isMermaid = className === 'language-mermaid';

    if (isFileTree) {
      return <FileTree content={String(children)} />;
    }

    if (isMermaid) {
      return <MermaidRenderer content={String(children)} />;
    }

    return isInline ? (
      <code className="token-inline" {...props}>{children}</code>
    ) : (
      <code className={`token-block ${className}`} {...props}>{children}</code>
    );
  },
};

/** 仅依赖 page，hidden 变化时由外层重渲染，此组件不重算 Markdown */
const DocContentBody = memo(function DocContentBody({ page }: { page: DocPage }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={DOC_MARKDOWN_COMPONENTS}
    >
      {page.markdown}
    </ReactMarkdown>
  );
});

const DocContent = memo(function DocContent({
  page,
  hidden,
  docMeta,
}: {
  page: DocPage;
  hidden: boolean;
  docMeta?: DocMetaForClient;
}) {
  const hasMeta = docMeta && (docMeta.status != null || docMeta.last_updated != null);
  
  // #region agent log
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      let strong: HTMLElement | null = null;
      try {
        // 使用 getElementById 更安全地查找元素，避免 ID 包含特殊字符时的选择器问题
        const article = document.getElementById(page.id);
        if (article) {
          strong = article.querySelector('.typo-ol .typo-li strong') as HTMLElement;
        }
      } catch (e) {
        // 如果 getElementById 失败，忽略错误
      }
      if (!strong) {
        strong = document.querySelector('.doc .typo-ol .typo-li strong') as HTMLElement;
      }
      if (!strong) {
        const allStrongs = Array.from(document.querySelectorAll('.doc strong'));
        fetch('http://127.0.0.1:7244/ingest/1f26b422-f826-460c-9c07-ec5fc241d990',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DocContent.tsx:useEffect',message:'Strong element not found',data:{pageId:page.id,allStrongsCount:allStrongs.length,articleIds:Array.from(document.querySelectorAll('article')).map(a=>a.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'ALL'})}).catch(()=>{});
        return;
      }
      const cs = window.getComputedStyle(strong);
      const li = strong.closest('li');
      const ol = strong.closest('ol');
      const article = strong.closest('article');
      const liCs = li ? window.getComputedStyle(li) : null;
      const olCs = ol ? window.getComputedStyle(ol) : null;
      const articleCs = article ? window.getComputedStyle(article) : null;
      fetch('http://127.0.0.1:7244/ingest/1f26b422-f826-460c-9c07-ec5fc241d990',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DocContent.tsx:useEffect',message:'Strong computed styles',data:{strong:{lineHeight:cs.lineHeight,height:cs.height,fontSize:cs.fontSize,display:cs.display,verticalAlign:cs.verticalAlign,boxSizing:cs.boxSizing},li:liCs?{lineHeight:liCs.lineHeight,height:liCs.height,fontSize:liCs.fontSize,paddingTop:liCs.paddingTop,paddingBottom:liCs.paddingBottom}:null,ol:olCs?{lineHeight:olCs.lineHeight}:null,article:articleCs?{lineHeight:articleCs.lineHeight}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v3',hypothesisId:'H1'})}).catch(()=>{});
      fetch('http://127.0.0.1:7244/ingest/1f26b422-f826-460c-9c07-ec5fc241d990',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DocContent.tsx:useEffect',message:'Strong inheritance check',data:{strongLineHeight:cs.lineHeight,liLineHeight:liCs?.lineHeight,strongFontSize:cs.fontSize,computedNormal:parseFloat(cs.fontSize)*1.2},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{});
      const strongRect = strong.getBoundingClientRect();
      const liRect = li?.getBoundingClientRect();
      const allStyles = window.getComputedStyle(strong);
      const styleSheet = Array.from(document.styleSheets).find(ss => {
        try {
          return Array.from(ss.cssRules || []).some((rule: any) => 
            rule.selectorText && (rule.selectorText.includes('.doc strong') || rule.selectorText.includes('.doc b'))
          );
        } catch { return false; }
      });
      fetch('http://127.0.0.1:7244/ingest/1f26b422-f826-460c-9c07-ec5fc241d990',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DocContent.tsx:useEffect',message:'Strong bounding box',data:{strongHeight:strongRect.height,strongWidth:strongRect.width,liHeight:liRect?.height,lineHeightValue:cs.lineHeight,display:cs.display,height:cs.height,verticalAlign:cs.verticalAlign},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'H4'})}).catch(()=>{});
      fetch('http://127.0.0.1:7244/ingest/1f26b422-f826-460c-9c07-ec5fc241d990',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DocContent.tsx:useEffect',message:'CSS rule check',data:{allComputedStyles:{display:allStyles.display,lineHeight:allStyles.lineHeight,height:allStyles.height,verticalAlign:allStyles.verticalAlign,fontSize:allStyles.fontSize,fontFamily:allStyles.fontFamily}},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'H3'})}).catch(()=>{});
    }, 100);
    return () => clearTimeout(timer);
  }, [page.id]);
  // #endregion
  
  return (
    <article id={page.id} className={`doc ${hidden ? 'doc--hidden' : ''}`}>
      <DocContentBody page={page} />
      {hasMeta && (
        <footer className="doc-status">
          {docMeta!.status != null && (
            <span className="doc-status__value" data-status={docMeta!.status}>
              {docMeta!.status.charAt(0).toUpperCase() + docMeta!.status.slice(1).toLowerCase()}
            </span>
          )}
          {docMeta!.last_updated != null && (
            <span className="doc-status__date">{docMeta!.last_updated}</span>
          )}
        </footer>
      )}
    </article>
  );
});

export { DocContentBody };
export default DocContent;
