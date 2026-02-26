"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#FF3232] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
