export async function getAllOrders() {
  const res = await fetch("http://localhost:5000/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(
    `http://localhost:5000/api/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}
