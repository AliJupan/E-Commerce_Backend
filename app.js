import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./src/config/database.js";

import {
  userController,
  productController,
  orderController,
  userValidator,
  productValidator,
  orderValidator,
} from "./src/container.js";

import userRoutes from "./src/router/userRoute.js";
import productRoute from "./src/router/productRoute.js";
import orderRoute from "./src/router/orderRoute.js";

import AuthenticationMiddleware from "./src/middleware/AuthenticationMiddleware.js";
import RoleMiddleware from "./src/middleware/RoleMiddleware.js";
import UserMiddleware from "./src/middleware/UserMiddleware.js";
import SuperAdminMiddleware from "./src/middleware/SuperAdminMiddleware.js";

// ----- CONFIG -----
const PORT = process.env.PORT || 4500;
const __dirname = dirname(fileURLToPath(import.meta.url));

// ----- APP INIT -----
const app = express();

// ----- MIDDLEWARES -----
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(helmet());
app.use(morgan("dev"));

// ----- RATE LIMITING -----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ----- STATIC FILES -----
app.use("/uploads", express.static(path.join(__dirname, "src/static/uploads")));

// ----- DATABASE -----
connectDB();

// ----- ROUTES -----
app.use(
  "/users",
  userRoutes(
    userController,
    AuthenticationMiddleware,
    RoleMiddleware,
    UserMiddleware,
    SuperAdminMiddleware,
    userValidator
  )
);

app.use(
  "/products",
  productRoute(
    productController,
    AuthenticationMiddleware,
    RoleMiddleware,
    productValidator
  )
);

app.use(
  "/orders",
  orderRoute(
    orderController,
    AuthenticationMiddleware,
    RoleMiddleware,
    orderValidator
  )
);

// ----- START SERVER -----
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
