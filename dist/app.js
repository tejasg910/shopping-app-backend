import express from "express";
import * as path from "path";
import morgan from "morgan";
const __dirname = path.resolve();
import NodeCache from "node-cache";
import { userRoutes } from "./routes/user/index.js";
import { adminRoutes } from "./routes/admin/index.js";
import { commonRoutes } from "./routes/common/index.js";
import { connectDb } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/errorHandler.js";
const app = express();
const PORT = process.env.PORT || 8000;
//importing routes
connectDb();
export const nodeCache = new NodeCache();
app.use(express.json());
//using routes
app.use(morgan("combined"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/", (req, res, next) => {
    console.log("Requested URL:", req.originalUrl);
    console.log("Resolved Path:", __dirname);
    next();
});
// Serve static files from the uploads directory
app.use(express.static(path.join(__dirname, "/")));
app.use(errorMiddleWare);
app.listen(PORT, () => console.log("Server started on 8000"));
