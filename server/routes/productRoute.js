import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/ProductControllers.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  restrictTo("admin"),
  multipleUpload,
  addProduct
);

router.get("/all", getAllProducts);

router.delete(
  "/delete/:productId",
  isAuthenticated,
  restrictTo("admin"),
  deleteProduct
);
router.put(
  "/update/:productId",
  isAuthenticated,
  restrictTo("admin"),
  multipleUpload,
  updateProduct
);
router.get(
  "/:productId",
  getProductById
);

export default router;