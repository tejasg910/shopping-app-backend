import express from "express";
import { getUserById, newUser, updateUserEmail, } from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
const router = express.Router();
router.post("/new", TryCatch(newUser));
// router.post("/update",  TryCatch(updateUser));
router.get("/getUserById/:id", TryCatch(getUserById));
router.put("/updateUserEmail/:id", TryCatch(updateUserEmail));
export default router;
