/* eslint-disable style/comma-dangle */
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";

import authRouter from "./routers/auth.routes.js";
import userRouter from "./routers/user.routes.js";

dotenv.config();

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/users", userRouter);

serve(
  {
    fetch: app.fetch,
    port: 5000,
  },
  (info) => {
    console.warn(`Server is running on http://localhost:${info.port}`);
  }
);
