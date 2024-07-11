import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { contact } from "../../controllers/user/other.js";
const router = express.Router();
router.post("/contact", TryCatch(contact));

export default router;
