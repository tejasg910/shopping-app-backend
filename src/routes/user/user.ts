import express from "express";
import {
  getAllUsers,
  getUserById,
  newUser,
} from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { adminOnly } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/getUserById/:id", TryCatch(getUserById));

export default router;
