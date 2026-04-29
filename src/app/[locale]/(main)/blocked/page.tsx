"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

export default function BlockedPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      router.replace("/");
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, router]);

  return (
    <section className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        <ShieldX className="w-16 h-16 mx-auto mb-6 text-[var(--color-text-tertiary)]" />
        <h1 className="text-[28px] font-bold tracking-[-0.01em] mb-3">
          Access Restricted
        </h1>
        <p className="text-[17px] text-[var(--color-text-secondary)] leading-[1.6] mb-6">
          This page is not available from your current network. If you believe
          this is an error, please try again from an authorized connection.
        </p>
        <p className="text-[15px] text-[var(--color-text-tertiary)]">
          Redirecting to the home page in{" "}
          <span className="font-semibold text-[var(--color-text-secondary)]">
            {seconds}
          </span>{" "}
          second{seconds !== 1 ? "s" : ""}…
        </p>
        <button
          onClick={() => router.replace("/")}
          className="mt-6 inline-flex items-center justify-center font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] text-[15px] px-5 py-2.5 rounded-[var(--radius-pill)] transition-colors"
        >
          Go home now
        </button>
      </div>
    </section>
  );
}
