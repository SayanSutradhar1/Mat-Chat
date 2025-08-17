import { useCallback, useEffect, useState } from "react";

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/**
 * useDuration
 *
 * A custom React hook that provides a `timeAgo` function to format
 * a given timestamp (Date | string | number) into a relative time string
 * (e.g. "just now", "10 seconds ago", "1 hr ago", "2 days ago").
 *
 * 🔄 The hook automatically re-renders every 1000ms (1 second) so
 * the returned time values stay up-to-date without manual refresh.
 *
 * @returns {(from: Date | string | number) => string}
 * A function `timeAgo` that takes a date (or timestamp) and
 * returns the human-readable "time ago" string.
 *
 * @example
 * const timeAgo = useDuration();
 *
 * <p>Created: {timeAgo("2025-08-17T10:30:00Z")}</p>
 * // → "5 min ago"
 *
 * <p>Updated: {timeAgo(Date.now() - 50_000)}</p>
 * // → "50 seconds ago"
 *
 * <p>Older: {timeAgo(Date.now() - 86_400_000)}</p>
 * // → "1 day ago"
 */


export function useDuration() {
  // dummy state just to force rerenders every second
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1); // trigger rerender
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = useCallback((from: Date | string | number) => {
    const past = new Date(from).getTime();
    return formatDuration(Date.now() - past);
  }, []);

  return getTimeAgo;
}
