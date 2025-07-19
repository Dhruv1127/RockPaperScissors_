import { users, gameResults, userStats, type User, type InsertUser, type GameResult, type InsertGameResult, type UserStats, type InsertUserStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createGameResult(gameResult: InsertGameResult): Promise<GameResult>;
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<InsertUserStats>): Promise<UserStats>;
  getRecentGames(userId: number, limit?: number): Promise<GameResult[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create initial stats for the user
    await db.insert(userStats).values({
      userId: user.id,
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    
    return user;
  }

  async createGameResult(gameResult: InsertGameResult): Promise<GameResult> {
    const [result] = await db
      .insert(gameResults)
      .values(gameResult)
      .returning();
    return result;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: number, statsUpdate: Partial<InsertUserStats>): Promise<UserStats> {
    const [stats] = await db
      .update(userStats)
      .set({ ...statsUpdate, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return stats;
  }

  async getRecentGames(userId: number, limit: number = 10): Promise<GameResult[]> {
    return await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.userId, userId))
      .orderBy(desc(gameResults.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
