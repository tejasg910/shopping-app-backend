import express from "express";
import { getUserById, } from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
const router = express.Router();
router.get("/getUserById/:id", TryCatch(getUserById));
export default router;
