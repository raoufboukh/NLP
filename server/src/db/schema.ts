import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  role: varchar("role").notNull(),
  accounttype: varchar("accounttype", { length: 10 }).default("basic"),
  appointments: jsonb("appointments"),
  scanresults: jsonb("scanresults"),
  createdat: timestamp("createdat").defaultNow(), // Utiliser "createdat" en minuscules
  updatedat: timestamp("updatedat")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Utiliser "updatedat" en minuscules
});

// Appointments table (one-to-many relationship)
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userid: integer("userid").notNull(), // Utilisation de integer au lieu de serial
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 15 }).notNull().default("scheduled"),
});

// Scan results table (one-to-many relationship)
export const scanresults = pgTable("scanresults", {
  id: serial("id").primaryKey(),
  userid: integer("userid").notNull(), // Utilisation de integer au lieu de serial
  date: timestamp("date").notNull(),
  result: text("result").notNull(),
  aianalysis: text("aianalysis").notNull(),
});
