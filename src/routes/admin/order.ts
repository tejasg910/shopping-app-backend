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
import { deleteUserById } from "../../controllers/admin/user.js";
import { createUser, updateUser } from "../../controllers/admin/user.js";
import {
  deleteOrder,
  deleteProductFromOrder,
  getAllOrders,
  udpateOrder,
  udpateOrderStatus,
} from "../../controllers/admin/order.js";
const router = express.Router();

router.get("/allOrders", adminOnly, TryCatch(getAllOrders));
router.put("/updateOrderStatus/:id", adminOnly, TryCatch(udpateOrderStatus));
router.put("/updateOrder", adminOnly, TryCatch(udpateOrder));
router.delete("/deleteProduct", adminOnly, TryCatch(deleteProductFromOrder));
router.delete("/delete/:id", adminOnly, TryCatch(deleteOrder));

export default router;
