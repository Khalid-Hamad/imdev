"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || t("loginFailed"));
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      toast.error(t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold tracking-[-0.01em]">imdev</h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-2">{t("signInTitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </div>
    </div>
  );
}
