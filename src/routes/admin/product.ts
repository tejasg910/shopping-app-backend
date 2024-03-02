import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import {
  deleteProductById,
  newProduct,
  udpateProduct,
} from "../../controllers/admin/product.js";
import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.js";
const router = express.Router();

router.post("/new", adminOnly, singleUpload, TryCatch(newProduct));
router.put("/update/:id", adminOnly, singleUpload, TryCatch(udpateProduct));
router.put("/delete/:id", adminOnly, singleUpload, TryCatch(deleteProductById));

export default router;
