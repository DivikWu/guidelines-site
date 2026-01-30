'use client';

import { useEffect, useRef } from 'react';
import { useSearch } from './SearchProvider';
import Icon from './Icon';

export default function HomeHero() {
  const { openSearch, preloadSearch } = useSearch();
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const element = searchRef.current;
    if (!element) return;

    const setSearchHidden = (hidden: boolean) => {
      document.documentElement.dataset.searchHidden = hidden ? 'true' : 'false';
    };

    setSearchHidden(false);

    if (!('IntersectionObserver' in window)) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = (window as Window).innerHeight;
      const isHidden = rect.bottom <= 0 || rect.top >= viewportHeight;
      setSearchHidden(isHidden);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSearchHidden(!entry.isIntersecting);
      },
      {
        rootMargin: '-56px 0px 0px 0px',
        threshold: 0
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      setSearchHidden(false);
    };
  }, []);

  return (
    <section className="home-hero">
      <div className="home-hero__background" aria-hidden="true" />
      <div className="home-hero__container">
        <div className="home-hero__content">
          <div className="home-hero__text">
            <h1 className="home-hero__title">UI/UX Guidelines</h1>
            <p className="home-hero__subtitle">
              构建一致、美观且易用的产品体验
            </p>
          </div>
          <div className="home-hero__search" ref={searchRef}>
            <Icon name="ds-icon-search-01" className="home-hero__search-icon" />
            <input
              type="search"
              className="home-hero__search-input"
              placeholder="搜索组件、规范或关键词"
              onMouseEnter={preloadSearch}
              onFocus={preloadSearch}
              onClick={() => openSearch()}
              readOnly
              aria-label="搜索"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
