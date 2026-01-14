'use client';

import { useEffect, useRef } from 'react';
import { DocPage } from '../data/docs';

export interface SearchResult {
  page: DocPage;
  matches: Array<{
    type: 'title' | 'content';
    text: string;
    index: number;
  }>;
  score: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (pageId: string) => void;
  query: string;
  selectedIndex?: number;
}

export default function SearchResults({ results, onSelect, query, selectedIndex = -1 }: SearchResultsProps) {
  const selectedRef = useRef<HTMLLIElement>(null);

  // 滚动到选中项
  useEffect(() => {
    if (selectedIndex >= 0 && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  if (results.length === 0) {
    return (
      <div className="search-results search-results--empty">
        <div className="search-results__empty">未找到匹配结果</div>
      </div>
    );
  }

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-results__highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  // 获取页面标题（从 markdown 中提取第一个 # 标题）
  const getPageTitle = (markdown: string): string => {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : '未命名';
  };

  // 获取匹配的文本片段（上下文）
  const getMatchSnippet = (markdown: string, query: string, maxLength: number = 100): string => {
    const lowerQuery = query.toLowerCase();
    const lowerMarkdown = markdown.toLowerCase();
    const index = lowerMarkdown.indexOf(lowerQuery);
    
    if (index === -1) return '';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(markdown.length, index + query.length + 70);
    let snippet = markdown.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < markdown.length) snippet = snippet + '...';
    
    return snippet.trim();
  };

  return (
    <div className="search-results">
      <div className="search-results__header">
        找到 {results.length} 个结果
      </div>
      <ul className="search-results__list">
        {results.map((result, index) => {
          const title = getPageTitle(result.page.markdown);
          const snippet = getMatchSnippet(result.page.markdown, query);
          const isSelected = index === selectedIndex;
          
          return (
            <li 
              key={result.page.id} 
              className="search-results__item"
              ref={isSelected ? selectedRef : null}
            >
              <button
                className={`search-results__button ${isSelected ? 'search-results__button--selected' : ''}`}
                onClick={() => onSelect(result.page.id)}
              >
                <div className="search-results__title">
                  {highlightText(title, query)}
                </div>
                {snippet && (
                  <div className="search-results__snippet">
                    {highlightText(snippet, query)}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
