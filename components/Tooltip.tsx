'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEventListener } from '@/hooks/useEventListener';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'right' | 'left' | 'top' | 'bottom';
  offset?: number;
  enterDelay?: number;
  exitDelay?: number;
}

export default function Tooltip({
  content,
  children,
  position = 'right',
  offset = 4,
  enterDelay = 150,
  exitDelay = 80,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        
        // Overflow check
        if (left + tooltipRect.width > viewportWidth) {
          left = triggerRect.left - tooltipRect.width - offset;
        }
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
    }

    // Viewport boundary adjustments
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) top = viewportHeight - tooltipRect.height - 8;
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) left = viewportWidth - tooltipRect.width - 8;

    setCoords({ top, left });
  }, [position, offset]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, enterDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, exitDelay);
  };

  // 仅在 tooltip 打开时绑定 scroll/resize，passive 提升滚动性能
  useEventListener(isVisible ? window : null, 'scroll', updatePosition, { capture: true, passive: true });
  useEventListener(isVisible ? window : null, 'resize', updatePosition, { passive: true });
  useEffect(() => {
    if (isVisible) updatePosition();
  }, [isVisible, updatePosition]);

  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
    'aria-describedby': isVisible ? 'tooltip-content' : undefined,
  });

  return (
    <>
      {triggerElement}
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className="tooltip-container"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 'var(--yami-z-index-tooltip, 1070)',
            pointerEvents: 'auto', // Allow hover on tooltip itself
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
          <style jsx>{`
            .tooltip-container {
              background: var(--yami-color-palette-black-1000, #000000);
              color: var(--yami-color-text-primary-dark, #FFFFFF);
              padding: var(--spacing-050, 4px) var(--spacing-100, 8px);
              border-radius: var(--radius-sm, 4px);
              font-size: var(--yami-typography-caption-medium-font-size-desktop, 12px);
              line-height: var(--yami-typography-caption-medium-line-height-desktop, 16px);
              font-weight: var(--yami-typography-font-weight-regular, 400);
              box-shadow: var(--shadow-1, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
              white-space: nowrap;
              pointer-events: auto;
              animation: tooltipFadeIn 0.15s ease-out;
            }

            [data-theme='dark'] .tooltip-container {
              background: var(--yami-color-surface-dark, #2A2A2A);
              border: 1px solid var(--yami-color-border-subtle-dark, rgba(255, 255, 255, 0.08));
              color: var(--yami-color-text-primary-dark, #FFFFFF);
            }

            @keyframes tooltipFadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
