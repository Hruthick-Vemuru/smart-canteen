import { Request, Response } from "express";
import Order from "../models/order.model";

/* =========================
   Create Order (USER)
   ========================= */
export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { items, totalAmount, userEmail } = req.body;

    if (!userEmail) {
      return res
        .status(400)
        .json({ message: "User not authenticated" });
    }

    const count = await Order.countDocuments();

    const order = await Order.create({
      orderNumber: count + 1,
      items,
      totalAmount,
      amount: totalAmount,
      userEmail,
    });

    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "Failed to create order" });
  }
};

/* =========================
   Get Orders (SELLER)
   ========================= */
export const getOrders = async (_req: Request, res: Response) => {
  const fiveMinutesAgo = new Date(
    Date.now() - 5 * 60 * 1000
  );

  const orders = await Order.find({
    paymentStatus: "SUCCESS",
    $or: [
      { isActive: true },
      { pickedUpAt: { $gte: fiveMinutesAgo } },
    ],
  }).sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   Get Orders (USER)
   ========================= */
export const getMyOrders = async (
  req: Request,
  res: Response
) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email required" });
  }

  const orders = await Order.find({
    userEmail: email,
  }).sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   Get Single Order
   ========================= */
export const getOrder = async (
  req: Request,
  res: Response
) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "Not found" });

  res.json(order);
};

/* =========================
   Update Status
   ========================= */
export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Not found" });

  order.status = status;
  await order.save();

  res.json(order);
};

/* =========================
   Picked Up
   ========================= */
export const markPickedUp = async (
  req: Request,
  res: Response
) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Not found" });

  order.isActive = false;
  order.pickedUpAt = new Date();

  await order.save();

  res.json(order);
};
