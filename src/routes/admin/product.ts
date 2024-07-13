import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import {
  changeFeatureProduct,
  changeFeatureProductStatus,
  deleteProductById,
  generateFakeProducts,
  getAllProducts,
  getFeatureProduct,
  newProduct,
  udpateProduct,
} from "../../controllers/admin/product.js";
import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.js";
const router = express.Router();

router.post("/new", adminOnly, singleUpload, TryCatch(newProduct));

router.get("/getAll", adminOnly, TryCatch(getAllProducts));
router.get("/getFeatureProduct", TryCatch(getFeatureProduct));
router.put("/updateFeatureProduct", adminOnly, TryCatch(changeFeatureProduct));
router.put("/updateFeatureProductStatus", adminOnly, TryCatch(changeFeatureProductStatus));

router.post("/dummyProducts", adminOnly, TryCatch(generateFakeProducts));
router.put("/update/:id", adminOnly, singleUpload, TryCatch(udpateProduct));
router.delete(
  "/delete/:id",
  adminOnly,
  singleUpload,
  TryCatch(deleteProductById)
);

export default router;
