import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { addProduct, getAllProducts } from "../controllers/ProductControllers.js";
import { nultipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/add-product",
  isAuthenticated,
  restrictTo("admin"),
  nultipleUpload,
  addProduct
);



router.get("/allProducts", getAllProducts);