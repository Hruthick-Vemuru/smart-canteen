import { Router } from "express";
import {
  getMenu,
  createMenuItem,
  toggleAvailability,
  deleteMenuItem,
} from "../controllers/menu.controller";

import { isSeller } from "../middleware/role.middleware";

const router = Router();

/**
 * GET /api/menu
 * Fetch all menu items (user + seller)
 */
router.get("/", getMenu);

/**
 * POST /api/menu
 * Create a new menu item (seller only)
 */
router.post("/", isSeller, createMenuItem);

router.patch("/:id", isSeller, toggleAvailability);

/**
 * DELETE /api/menu/:id
 * Delete a menu item (seller only)
 */
router.delete("/:id", isSeller, deleteMenuItem);

export default router;
