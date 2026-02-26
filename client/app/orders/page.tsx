"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Main orders page. For users, it redirects to their specific order history.
 * For staff/admin, this could eventually be a combined view.
 */
export default function OrdersPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/my-orders");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-[#FF3232] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
