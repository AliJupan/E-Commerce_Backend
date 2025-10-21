import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/database.js";

import {
  userController,
  authController,
  productController,
  orderController,
  userValidator,
  productValidator,
  orderValidator,
} from "./container.js";

import authRoutes from "./router/authRoute.js";
import userRoutes from "./router/userRoute.js";
import productRoute from "./router/productRoute.js";
import orderRoute from "./router/orderRoute.js";

import AuthenticationMiddleware from "./middleware/AuthenticationMiddleware.js";
import RoleMiddleware from "./middleware/RoleMiddleware.js";
import UserMiddleware from "./middleware/UserMiddleware.js";
import SuperAdminMiddleware from "./middleware/SuperAdminMiddleware.js";

// ----- CONFIG -----
const PORT = process.env.PORT || 4500;
const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ORIGIN = "http://localhost:5173";

// ----- APP INIT -----
const app = express();

// ----- MIDDLEWARES -----
app.use(
  cors({
    origin: FRONTEND_ORIGIN, // only allow frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you use cookies or auth headers
  })
);
app.use(bodyParser.json());
app.use(fileUpload());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("dev"));

// ----- RATE LIMITING -----
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // limit each IP to 100 requests per window
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// ----- STATIC FILES -----
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    next();
  },
  express.static(path.join(__dirname, "/static/uploads"))
);

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
  "/auth",
  authRoutes(
    authController,
    AuthenticationMiddleware,
    UserMiddleware,
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
