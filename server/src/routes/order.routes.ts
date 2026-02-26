import { Router } from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  markPickedUp,
} from "../controllers/order.controller";

import { isSeller } from "../middleware/role.middleware";

const router = Router();

router.post("/", createOrder);
router.get("/", isSeller, getOrders); // Only seller should see all orders
router.get("/my", getMyOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", isSeller, updateOrderStatus);
router.patch("/:id/pickup", isSeller, markPickedUp);

export default router;
