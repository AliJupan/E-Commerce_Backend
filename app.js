import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { connectDB } from "./src/config/database.js";

import { userController,userValidator } from "./src/container.js";

import userRoutes from "./src/router/userRoute.js";

import AuthenticationMiddleware from "./src/middleware/AuthenticationMiddleware.js"
import RoleMiddleware from "./src/middleware/RoleMiddleware.js";
import UserMiddleware from "./src/middleware/UserMiddleware.js";
import SuperAdminMiddleware from "./src/middleware/SuperAdminMiddleware.js";

const PORT = process.env.PORT || 4500

const app = express()
app.use(cors())
app.use(bodyParser.json())

connectDB();

app.use('/users',userRoutes(userController,AuthenticationMiddleware,RoleMiddleware,UserMiddleware,SuperAdminMiddleware,userValidator))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});