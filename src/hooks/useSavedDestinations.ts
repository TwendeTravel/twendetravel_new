import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { savedDestinationsService } from '@/services/savedDestinations';

// Cookie helpers
const COOKIE_NAME = 'savedDestinations';
const getCookieIds = (): string[] => {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {
    // ignore
  }
  return [];
};
const setCookieIds = (ids: string[]) => {
  const value = encodeURIComponent(JSON.stringify(ids));
  document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${60 * 60 * 24 * 365}`;
};

export const useSavedDestinations = () => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load on mount
  useEffect(() => {
    if (user) {
      // merge cookie then fetch DB
      const cookieIds = getCookieIds();
      cookieIds.forEach(id => {
        savedDestinationsService.save(user.id, id).catch(() => {});
      });
      // clear cookie after merging
      setCookieIds([]);
      // fetch saved
      savedDestinationsService.listForUser(user.id)
        .then(data => setSavedIds(data.map(d => d.destination_id)))
        .catch(() => setSavedIds([]));
    } else {
      setSavedIds(getCookieIds());
    }
  }, [user]);

  const save = useCallback((destId: string) => {
    if (user) {
      savedDestinationsService.save(user.id, destId).then(() => {
        setSavedIds(prev => [...prev, destId]);
      });
    } else {
      const ids = getCookieIds();
      if (!ids.includes(destId)) {
        const next = [...ids, destId];
        setCookieIds(next);
        setSavedIds(next);
      }
    }
  }, [user]);

  const unsave = useCallback((destId: string) => {
    if (user) {
      savedDestinationsService.unsave(user.id, destId).then(() => {
        setSavedIds(prev => prev.filter(id => id !== destId));
      });
    } else {
      const ids = getCookieIds().filter(id => id !== destId);
      setCookieIds(ids);
      setSavedIds(ids);
    }
  }, [user]);

  return { savedIds, save, unsave };
};
