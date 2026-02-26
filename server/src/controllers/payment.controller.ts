import { Request, Response } from "express";
import Order from "../models/order.model";
import crypto from "crypto";

/* =========================
   Create Payment
   ========================= */
export const createPayment = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "SUCCESS") {
            return res.status(400).json({ message: "Order already paid" });
        }

        // Generate a mock paymentId
        const paymentId = "pay_" + crypto.randomBytes(8).toString("hex");

        order.paymentId = paymentId;
        order.paymentStatus = "PENDING";
        order.status = "PAYMENT_PENDING";
        await order.save();

        res.json({ paymentId, amount: order.totalAmount });
    } catch (error) {
        res.status(500).json({ message: "Failed to create payment" });
    }
};

/* =========================
   Verify Payment
   ========================= */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, paymentId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "SUCCESS") {
            return res.status(400).json({ message: "Order already paid" });
        }

        if (status === "SUCCESS") {
            order.paymentStatus = "SUCCESS";
            order.paymentId = paymentId;
            order.paidAt = new Date();
            order.status = "PLACED";
        } else {
            order.paymentStatus = "FAILED";
            order.status = "PAYMENT_FAILED";
        }

        await order.save();

        res.json({
            message: status === "SUCCESS" ? "Payment successful" : "Payment failed",
            order
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify payment" });
    }
};
