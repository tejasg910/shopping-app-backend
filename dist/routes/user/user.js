import express from "express";
import { getUserById, newUser, } from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
const router = express.Router();
router.post("/new", TryCatch(newUser));
// router.post("/update",  TryCatch(updateUser));
router.get("/getUserById/:id", TryCatch(getUserById));
export default router;
