import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // In the browser, always use same-origin to avoid CORS/host mismatch in production.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
