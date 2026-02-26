"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.replace("/seller/login");
            return;
        }

        if (session.user.role !== "SELLER") {
            router.replace("/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div className="p-6">Loading...</div>;
    }

    if (!session || session.user.role !== "SELLER") {
        return null; // Avoid flashing content before redirect
    }

    return <>{children}</>;
}
