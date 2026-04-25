"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  targetType: string;
  targetId: string;
}

export function Reactions({ targetType, targetId }: ReactionsProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/reactions?targetType=${targetType}&targetId=${targetId}`)
      .then((r) => r.json())
      .then((data) => {
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
        setUserReaction(data.userReaction || null);
      })
      .catch(() => {});
  }, [targetType, targetId]);

  async function react(type: "like" | "dislike") {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, type }),
      });
      const data = await res.json();

      if (data.action === "removed") {
        if (type === "like") setLikes((p) => Math.max(0, p - 1));
        else setDislikes((p) => Math.max(0, p - 1));
        setUserReaction(null);
      } else if (data.action === "changed") {
        if (type === "like") {
          setLikes((p) => p + 1);
          setDislikes((p) => Math.max(0, p - 1));
        } else {
          setDislikes((p) => p + 1);
          setLikes((p) => Math.max(0, p - 1));
        }
        setUserReaction(type);
      } else {
        if (type === "like") setLikes((p) => p + 1);
        else setDislikes((p) => p + 1);
        setUserReaction(type);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => react("like")}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] text-[13px] font-medium border transition-colors",
          userReaction === "like"
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        )}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        {likes > 0 && <span>{likes}</span>}
      </button>
      <button
        onClick={() => react("dislike")}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] text-[13px] font-medium border transition-colors",
          userReaction === "dislike"
            ? "border-[var(--color-error)] bg-[var(--color-error)]/10 text-[var(--color-error)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-error)] hover:text-[var(--color-error)]"
        )}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        {dislikes > 0 && <span>{dislikes}</span>}
      </button>
    </div>
  );
}
