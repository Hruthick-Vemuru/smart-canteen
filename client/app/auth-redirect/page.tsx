"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    if (session.user.role === "SELLER") {
      router.replace("/seller/dashboard");
    } else {
      router.replace("/menu");
    }
  }, [session, status, router]);

  return <div className="p-6">Redirecting...</div>;
}
