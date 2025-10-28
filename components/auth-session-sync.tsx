"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth-store";
import type { User as StoreUser } from "@/types/auth";

export default function AuthSessionSync() {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      const mappedUser: StoreUser = {
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || undefined,
        plan: (session.user.plan as any) || "free",
        stripeCustomerId: undefined,
        stripeSubscriptionId: undefined,
        subscriptionStatus:
          (session.user.subscriptionStatus as any) || "active",
        trialEndsAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(mappedUser);
    } else {
      setUser(null);
    }
  }, [session, status, setUser]);

  return null;
}
