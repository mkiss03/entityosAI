import { useEffect, useRef } from "react";

/**
 * Utility function to combine CSS class names
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Custom hook for setting up intervals
 */
export function useInterval(callback, delay) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedRef.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Format a number as a percentage string
 */
export function formatPct(x) {
  const v = Math.max(0, Math.min(1, x));
  return `${Math.round(v * 100)}%`;
}

/**
 * Development-only logging helper
 * Logs messages only in dev mode, silent in production
 */
export const devLog = {
  log: (...args) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Errors always logged (even in production for monitoring)
    console.error(...args);
  },
};
