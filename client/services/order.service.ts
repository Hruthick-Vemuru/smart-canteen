const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* =========================
   TYPES
   ========================= */
export type OrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "PAYMENT_FAILED";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  _id: string;
  orderNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  paymentId?: string;
  userEmail: string;
  createdAt: string;
  pickedUpAt?: string;
};

/* =========================
   CREATE ORDER (USER)
   ========================= */
export async function createOrder(
  items: OrderItem[],
  totalAmount: number,
  userEmail: string
): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      totalAmount,
      userEmail,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to place order");
  }

  return res.json();
}

/* =========================
   GET MY ORDERS (USER)
   ========================= */
export async function getMyOrders(
  email: string
): Promise<Order[]> {
  const res = await fetch(
    `${API_URL}/api/orders/my?email=${email}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch my orders");
  }

  return res.json();
}

/* =========================
   GET SINGLE ORDER
   ========================= */
export async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}

/* =========================
   GET ORDERS (SELLER)
   ========================= */
export async function getOrders(role?: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/api/orders`, {
    cache: "no-store",
    headers: {
      "x-user-role": role || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

/* =========================
   UPDATE ORDER STATUS (SELLER)
   ========================= */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  role?: string
): Promise<Order> {
  const res = await fetch(
    `${API_URL}/api/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": role || "",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }

  return res.json();
}

/* =========================
   MARK ORDER AS PICKED UP (SELLER)
   ========================= */
export async function markPickedUp(
  orderId: string,
  role?: string
): Promise<Order> {
  const res = await fetch(
    `${API_URL}/api/orders/${orderId}/pickup`,
    {
      method: "PATCH",
      headers: {
        "x-user-role": role || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark order as picked up");
  }

  return res.json();
}
