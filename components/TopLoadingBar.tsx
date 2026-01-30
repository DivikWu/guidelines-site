'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const INITIAL_PROGRESS = 10;
const MIN_DISPLAY_MS = 200;
const PROGRESS_DURATION_MS = 380;
const HOLD_AT_100_MS = 150;
const FADEOUT_MS = 200;

/** Easing: fast at start, slow at end (ease-out) */
function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export default function TopLoadingBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const startedAtRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const isFirstMount = prevPathnameRef.current === null;
    prevPathnameRef.current = pathname;

    const start = () => {
      startedAtRef.current = Date.now();
      setOpacity(1);
      setProgress(INITIAL_PROGRESS);
      setVisible(true);
    };

    if (isFirstMount) {
      start();
    } else {
      start();
    }

    const cancelTimers = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const runProgress = () => {
      const elapsed = Date.now() - startedAtRef.current;
      if (elapsed >= PROGRESS_DURATION_MS) {
        setProgress(100);
        const timeUntilMinDisplay = MIN_DISPLAY_MS - Math.min(elapsed, MIN_DISPLAY_MS);
        const delay = Math.max(0, timeUntilMinDisplay) + HOLD_AT_100_MS;
        timeoutRef.current = setTimeout(() => {
          setOpacity(0);
          timeoutRef.current = setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, FADEOUT_MS);
        }, delay);
        return;
      }
      const t = elapsed / PROGRESS_DURATION_MS;
      const eased = easeOut(t);
      setProgress(INITIAL_PROGRESS + (100 - INITIAL_PROGRESS) * eased);
      rafRef.current = requestAnimationFrame(runProgress);
    };

    rafRef.current = requestAnimationFrame(runProgress);

    return () => {
      cancelTimers();
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="top-loading-bar"
      aria-hidden="true"
      style={{
        opacity,
        ['--progress' as string]: `${progress}%`,
      }}
    >
      <div className="top-loading-bar__fill" />
    </div>
  );
}
