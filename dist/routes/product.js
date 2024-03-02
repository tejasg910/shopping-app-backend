import express from "express";
import { TryCatch } from "../middlewares/errorHandler.js";
import { getAllCategories, getLatestProducts, newProduct, } from "../controllers/admin/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
router.post("/new", adminOnly, singleUpload, TryCatch(newProduct));
router.get("/latest", TryCatch(getLatestProducts));
router.get("/categories", TryCatch(getAllCategories));
export default router;