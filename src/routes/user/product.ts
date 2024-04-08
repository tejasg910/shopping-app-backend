import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { newProduct } from "../../controllers/admin/product.js";
import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.js";
import { searchProducts } from "../../controllers/user/products.js";
const router = express.Router();

// router.get("/latest", TryCatch(getLatestProducts));
router.get("/search", TryCatch(searchProducts));
// router.get("/categories", TryCatch(getAllCategories));

export default router;
