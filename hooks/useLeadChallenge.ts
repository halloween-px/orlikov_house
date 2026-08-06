"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLeadChallenge } from "@/lib/submit-lead";

export function useLeadChallenge(enabled = true) {
  const [challenge, setChallenge] = useState("");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setReady(false);
    try {
      const next = await fetchLeadChallenge();
      setChallenge(next);
      setReady(true);
      return next;
    } catch {
      setChallenge("");
      setReady(false);
      return "";
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setChallenge("");
      setReady(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const next = await fetchLeadChallenge();
        if (!cancelled) {
          setChallenge(next);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setChallenge("");
          setReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { challenge, ready, refresh };
}
