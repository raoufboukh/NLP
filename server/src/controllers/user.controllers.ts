/* eslint-disable style/comma-dangle */
/* eslint-disable antfu/top-level-function */
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { notifications, users } from "../db/schema.js";

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

  await db.insert(notifications).values({
    userid: userId,
    appointments: user[0].appointments,
    role: "admin",
  });

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

export const updateAccountType = async (c: any) => {
  const userId = c.get("user").id;
  const subscribe = await db
    .update(users)
    .set({ accounttype: "premium" })
    .where(eq(users.id, userId))
    .returning();

  setTimeout(
    async () => {
      await db
        .update(users)
        .set({ accounttype: "basic" })
        .where(eq(users.id, userId));
    },
    30 * 24 * 60 * 60 * 1000
  );

  return c.json(subscribe[0]);
};

export const getNotifications = async (c: any) => {
  const userRole = c.get("user").role;
  if (userRole !== "admin") {
    return c.json({ message: "Unauthorized" }, 403);
  }

  const notificationsList = await db
    .select()
    .from(notifications)
    .where(eq(notifications.role, "admin"));
  return c.json(notificationsList);
};

export const updateNotificationStatus = async (c: any) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();

  const updatedNotification = await db
    .update(notifications)
    .set({ status })
    .where(eq(notifications.id, id))
    .returning();

  return c.json(updatedNotification[0]);
};
