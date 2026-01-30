'use client';

import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionVisibleOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Hook to detect if an element is visible in the viewport using IntersectionObserver.
 *
 * @param ref - React ref to the element to observe. Pass a ref from useRef() so the
 *   reference is stable across renders; an inline ref object created each render
 *   will cause the effect to run on every render.
 * @param options - IntersectionObserver options (root, rootMargin, threshold)
 * @returns boolean indicating if the element is visible
 */
export function useIntersectionVisible(
  ref: RefObject<Element | null>,
  options: UseIntersectionVisibleOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') {
      return;
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume visible if IntersectionObserver is not supported
      setIsVisible(true);
      return;
    }

    const observerOptions: IntersectionObserverInit = {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
      threshold: options.threshold ?? 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    }, observerOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.root, options.rootMargin, options.threshold]);

  return isVisible;
}
