'use client';

import { useEffect, useRef } from 'react';

/**
 * 稳定的事件监听 hook：内部用 ref 存 handler，effect 仅依赖 target/type/options，避免重复 add/remove。
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | null | undefined,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void;
export function useEventListener(
  target: EventTarget | null | undefined,
  type: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions
): void;
export function useEventListener(
  target: EventTarget | null | undefined,
  type: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions
): void {
  const handlerRef = useRef(handler);
  const optionsRef = useRef(options);
  handlerRef.current = handler;
  optionsRef.current = options;

  useEffect(() => {
    if (target == null) return;
    const fn = (e: Event) => handlerRef.current(e);
    const opts = optionsRef.current;
    target.addEventListener(type, fn, opts);
    return () => target.removeEventListener(type, fn, opts);
  }, [target, type]);
}
