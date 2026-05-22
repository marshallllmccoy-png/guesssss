'use client';

import { useState, useCallback, useEffect } from 'react';

const SEEN_KEY = 'seen-image-ids';

function loadSeenIds(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function persistSeenIds(ids: string[]): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // storage full or unavailable
  }
}

export function useSeenImages() {
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSeenIds(loadSeenIds());
    setIsHydrated(true);
  }, []);

  const markAsSeen = useCallback((id: string) => {
    setSeenIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      persistSeenIds(next);
      return next;
    });
  }, []);

  const resetSeen = useCallback(() => {
    setSeenIds([]);
    persistSeenIds([]);
  }, []);

  return { seenIds, markAsSeen, resetSeen, isHydrated };
}
