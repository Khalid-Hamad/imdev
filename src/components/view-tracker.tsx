"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  pagePath: string;
  targetType?: string;
  targetId?: string;
}

export function ViewTracker({ pagePath, targetType, targetId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath, targetType, targetId }),
    }).catch(() => {});
  }, [pagePath, targetType, targetId]);

  return null;
}
