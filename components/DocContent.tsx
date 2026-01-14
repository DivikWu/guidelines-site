'use client';

import ReactMarkdown from 'react-markdown';
import { DocPage } from '../data/docs';

export default function DocContent({ page, hidden }: { page: DocPage; hidden: boolean }) {
  return (
    <article id={page.id} className={`doc ${hidden ? 'doc--hidden' : ''}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="typo-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="typo-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="typo-h3" {...props} />,
          p: ({ node, ...props }) => <p className="typo-p" {...props} />,
          ul: ({ node, ...props }) => <ul className="typo-ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="typo-ol" {...props} />,
          li: ({ node, ...props }) => <li className="typo-li" {...props} />,
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
    </article>
  );
}
