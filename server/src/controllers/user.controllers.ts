/* eslint-disable antfu/top-level-function */
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { users } from "../db/schema.js";

export const getAllUsers = async (c: any) => {
  const allUsers = await db.select().from(users).where(eq(users.role, "user"));
  return c.json(allUsers);
};

export const bookAppointment = async (c: any) => {
  const { date, description } = await c.req.json();
  const userId = c.get("user").id;

  const user = await db
    .update(users)
    .set({ appointments: { date, description } })
    .where(eq(users.id, userId))
    .returning();

  return c.json(user[0].appointments);
};

export const getScan = async (c: any) => {
  const userId = c.get("user").id;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return c.json(user[0].scanresults);
};

export const addScan = async (c: any) => {
  const { date, result, aiAnalysis } = await c.req.json();
  const userId = c.get("user").id;

  const updatedUser = await db
    .update(users)
    .set({ scanresults: { date, result, aiAnalysis } })
    .where(eq(users.id, userId))
    .returning();

  return c.json(updatedUser[0].scanresults);
};
