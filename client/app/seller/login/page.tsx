"use client";

import { signIn } from "next-auth/react";
import Container from "@/components/ui/Container";

export default function SellerLoginPage() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-2xl font-semibold mb-4">
        Seller Login
      </h1>

      <button
        onClick={() =>
          signIn("google", { callbackUrl: "/auth-redirect" })

        }
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Continue with Google
      </button>
    </Container>
  );
}
