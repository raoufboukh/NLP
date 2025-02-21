/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable node/no-process-env */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(id: number, c: any) {
  const token = jwt.sign({ id }, SECRET, { expiresIn: "7d" });
  c.header("Set-Cookie", `token=${token}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}

export async function verifyToken(c: any, next: any) {
  try {
    const cookieHeader = c.req.header("Cookie");
    const cookies = new Map(
      cookieHeader?.split(";").map((c: any) => c.trim().split("=")),
    );
    const token = cookies.get("token");
    if (!token)
      return c.json({ message: "Unauthorized - No Token" }, 401);

    const decoded = jwt.verify(token as string, SECRET);
    if (!decoded)
      return c.json({ message: "Unauthorized" }, 401);

    c.set("user", decoded);
    await next();
  }
  catch (error) {
    return c.json({ message: "Internet Server Error" }, 500);
  }
}
