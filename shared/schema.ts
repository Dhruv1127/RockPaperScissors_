import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  playerChoice: text("player_choice", { enum: ["rock", "paper", "scissors"] }).notNull(),
  computerChoice: text("computer_choice", { enum: ["rock", "paper", "scissors"] }).notNull(),
  result: text("result", { enum: ["win", "lose", "draw"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(),
  totalGames: integer("total_games").default(0).notNull(),
  wins: integer("wins").default(0).notNull(),
  losses: integer("losses").default(0).notNull(),
  draws: integer("draws").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  bestStreak: integer("best_streak").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  gameResults: many(gameResults),
  stats: one(userStats),
}));

export const gameResultsRelations = relations(gameResults, ({ one }) => ({
  user: one(users, {
    fields: [gameResults.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameResultSchema = createInsertSchema(gameResults).pick({
  userId: true,
  playerChoice: true,
  computerChoice: true,
  result: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  userId: true,
  totalGames: true,
  wins: true,
  losses: true,
  draws: true,
  currentStreak: true,
  bestStreak: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;
