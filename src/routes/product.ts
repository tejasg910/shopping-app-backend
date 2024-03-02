import express from "express";
import { TryCatch } from "../middlewares/errorHandler.js";
import { newProduct } from "../controllers/user/product.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.post("/new", singleUpload, TryCatch(newProduct));

export default router;
