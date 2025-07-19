import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Game result routes
  app.post("/api/game-results", async (req, res) => {
    try {
      const gameData = insertGameResultSchema.parse(req.body);
      const gameResult = await storage.createGameResult(gameData);
      
      // Update user stats
      if (gameData.userId) {
        const currentStats = await storage.getUserStats(gameData.userId);
        if (currentStats) {
          const newStats = {
            totalGames: currentStats.totalGames + 1,
            wins: gameData.result === 'win' ? currentStats.wins + 1 : currentStats.wins,
            losses: gameData.result === 'lose' ? currentStats.losses + 1 : currentStats.losses,
            draws: gameData.result === 'draw' ? currentStats.draws + 1 : currentStats.draws,
            currentStreak: gameData.result === 'win' ? currentStats.currentStreak + 1 : 0,
            bestStreak: gameData.result === 'win' 
              ? Math.max(currentStats.bestStreak, currentStats.currentStreak + 1)
              : currentStats.bestStreak,
          };
          
          await storage.updateUserStats(gameData.userId, newStats);
        }
      }
      
      res.json({ gameResult });
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  // User stats routes
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Recent games routes
  app.get("/api/users/:userId/recent-games", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentGames = await storage.getRecentGames(userId, limit);
      res.json({ recentGames });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
