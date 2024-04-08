import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import {
  deleteProductById,
  generateFakeProducts,
  getAllProducts,
  newProduct,
  udpateProduct,
} from "../../controllers/admin/product.js";
import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.js";
import {
  getBarChartsStats,
  getDashboardStats,
  getLineChartsStats,
  getPieChartsStats,
} from "../../controllers/admin/stats.js";
const router = express.Router();

router.get("/dashboard", adminOnly, TryCatch(getDashboardStats));

router.get("/pie", adminOnly, TryCatch(getPieChartsStats));
router.get("/bar", adminOnly, TryCatch(getBarChartsStats));
router.get("/line", adminOnly, TryCatch(getLineChartsStats));

export default router;
