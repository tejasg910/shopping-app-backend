import express from "express";
import * as path from "path";
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8000;
//importing routes
connectDb();
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import { connectDb } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/errorHandler.js";
app.use(express.json());
//using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/", (req, res, next) => {
    console.log("Requested URL:", req.originalUrl);
    console.log("Resolved Path:", __dirname);
    next();
});
// Serve static files from the uploads directory
app.use("/uploads", express.static("./uploads"));
app.use(errorMiddleWare);
app.listen(PORT, () => console.log("Server started on 8000"));
