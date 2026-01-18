import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  addToCart,
  deleteFromCart,
  getCart,
  updateQuantity,
} from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.post("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, deleteFromCart);

export default router;
