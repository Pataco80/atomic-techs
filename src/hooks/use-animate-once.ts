"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseAnimateOnceOptions = {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  disabled?: boolean;
};

type UseAnimateOnceReturn = {
  ref: React.RefObject<HTMLElement | null>;
  hasAnimated: boolean;
  isInView: boolean;
  reset: () => void;
};

/**
 * Plays an entrance animation a single time, when the element first scrolls
 * into view (respects prefers-reduced-motion by starting "already animated").
 */
export function useAnimateOnce(
  options: UseAnimateOnceOptions = {},
): UseAnimateOnceReturn {
  const {
    threshold = 0.2,
    rootMargin = "0px",
    delay = 0,
    disabled = false,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isInView, setIsInView] = useState(false);

  const reset = useCallback(() => {
    setHasAnimated(false);
    setIsInView(false);
  }, []);

  useEffect(() => {
    if (disabled || hasAnimated || !ref.current) return;

    const element = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          if (delay > 0) {
            setTimeout(() => {
              setHasAnimated(true);
            }, delay);
          } else {
            setHasAnimated(true);
          }
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, hasAnimated, threshold, rootMargin, delay]);

  return { ref, hasAnimated, isInView, reset };
}
