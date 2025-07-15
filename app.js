import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from "./src/config/database.js";

import {
  userController,
  productController,
  userValidator,
  productValidator,
} from "./src/container.js";

import userRoutes from "./src/router/userRoute.js";
import productRoute from "./src/router/productRoute.js";

import AuthenticationMiddleware from "./src/middleware/AuthenticationMiddleware.js";
import RoleMiddleware from "./src/middleware/RoleMiddleware.js";
import UserMiddleware from "./src/middleware/UserMiddleware.js";
import SuperAdminMiddleware from "./src/middleware/SuperAdminMiddleware.js";

const PORT = process.env.PORT || 4500;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

connectDB();

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/documents", express.static(path.join(__dirname, "static/uploads")));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
