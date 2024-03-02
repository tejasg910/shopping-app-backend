import express from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  newUser,
} from "../controllers/user/user.js";
import { TryCatch } from "../middlewares/errorHandler.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", TryCatch(newUser));
router.get("/get-all-users", TryCatch(adminOnly), TryCatch(getAllUsers));
router.get("/getUserById/:id", TryCatch(getUserById));
router.delete(
  "/deleteUserById/:id",
  TryCatch(adminOnly),
  TryCatch(deleteUserById)
);

export default router;
