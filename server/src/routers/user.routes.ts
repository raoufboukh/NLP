import { Hono } from "hono";

import { addScan, bookAppointment, getAllUsers, getScan } from "../controllers/user.controllers.js";
import { verifyToken } from "../lib/utils.js";

const userRouter = new Hono();

// Get all users
userRouter.get("/", getAllUsers);

// Book Appointment
userRouter.post("/appointments", verifyToken, bookAppointment);

// Get Scan Results
userRouter.get("/scan-results", verifyToken, getScan);

// Add Scan Results
userRouter.post("/scan-results", verifyToken, addScan);

export default userRouter;
