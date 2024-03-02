import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import {
  deleteProductById,
  getAllProducts,
  newProduct,
  udpateProduct,
} from "../../controllers/admin/product.js";
import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.js";
import { newUser } from "../../controllers/user/user.js";
import { createUser, updateUser } from "../../controllers/admin/user.js";
const router = express.Router();

router.post("/new", adminOnly, singleUpload, TryCatch(createUser));
router.post("/update", adminOnly, singleUpload, TryCatch(updateUser));

router.delete("/delete/:id", adminOnly, TryCatch(deleteProductById));

export default router;
