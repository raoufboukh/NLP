/* eslint-disable antfu/top-level-function */
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { comparePassword, generateToken, hashPassword } from "../lib/utils.js";

export const register = async (c: any) => {
  const { username, email, password } = await c.req.json();

  if (!username || !email || !password)
    return c.json({ message: "All fields are required" }, 400);

  if (!/\w+@\w{5,}\.\w{2,}/.test(email))
    return c.json({ message: "Invalid email" }, 400);

  if (!email)
    return c.json({ message: "Email required" }, 400);

  if (!username)
    return c.json({ message: "Username required" }, 400);

  if (!password)
    return c.json({ message: "Password required" }, 400);

  if (password.length < 6)
    return c.json({ message: "Password must be at least 6 characters" }, 400);

  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userExists.length > 0)
    return c.json({ message: "User already exists" }, 400);

  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({ username, email, password: hashedPassword, role: "user", accounttype: "basic" });

  const newUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  generateToken(newUser[0].id, c);

  return c.json(newUser[0], 201);
};

export const login = async (c: any) => {
  const { email, password } = await c.req.json();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user.length)
    return c.json({ message: "Invalid credentials" }, 401);

  const isMatch = await comparePassword(password, user[0].password);
  if (!isMatch)
    return c.json({ message: "Invalid credentials" }, 401);

  generateToken(user[0].id, c);
  return c.json(user[0], 200);
};

export const logout = async (c: any) => {
  c.header("Set-Cookie", `token=''`, { maxAge: 0 });
  return c.json({ message: "Logged out" });
};

export const check = async (c: any) => {
  return c.json(c.get("user"));
};
