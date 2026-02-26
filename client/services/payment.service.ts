const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createPayment = async (orderId: string) => {
    const res = await fetch(`${API_URL}/api/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
    });
    if (!res.ok) throw new Error("Failed to create payment");
    return res.json();
};

export const verifyPayment = async (
    orderId: string,
    paymentId: string,
    status: "SUCCESS" | "FAILED"
) => {
    const res = await fetch(`${API_URL}/api/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId, status }),
    });
    if (!res.ok) throw new Error("Failed to verify payment");
    return res.json();
};
