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
const router = express.Router();

router.post("/new", adminOnly, singleUpload, TryCatch(newProduct));

router.get("/getAll", adminOnly, TryCatch(getAllProducts));

router.post("/dummyProducts", adminOnly, TryCatch(generateFakeProducts));
router.put("/update/:id", adminOnly, singleUpload, TryCatch(udpateProduct));
router.delete(
  "/delete/:id",
  adminOnly,
  singleUpload,
  TryCatch(deleteProductById)
);

export default router;
