import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import {
  getAllCategories,
  getLatestProducts,
  searchProducts,
} from "../../controllers/common/products.js";
import { getProductById } from "../../controllers/common/products.js";

const router = express.Router();

router.get("/latest", TryCatch(getLatestProducts));

router.get("/categories", TryCatch(getAllCategories));
router.get("/search", TryCatch(searchProducts));
router.get("/:id", TryCatch(getProductById));
export default router;
