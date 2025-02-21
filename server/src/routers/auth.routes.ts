import { Hono } from "hono";

import { check, login, logout, register } from "../controllers/auth.controllers.js";
import {
  verifyToken,
} from "../lib/utils.js";

const authRouter = new Hono();

// Register User
authRouter.post("/register", register);

// Login User
authRouter.post("/login", login);

// Logout
authRouter.get("/logout", verifyToken, logout);

// Check Auth
authRouter.get("/check", verifyToken, check);

export default authRouter;
