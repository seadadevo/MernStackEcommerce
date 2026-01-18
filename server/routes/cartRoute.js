import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  addToCart,
  addToCart,
  getCart,
  updateQuantity,
} from "../controllers/cartControllers";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, removeEventListener);

export default router;
