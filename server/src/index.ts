import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { Hono } from "hono";

dotenv.config();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.warn(`Server is running on http://localhost:${info.port}`);
});
