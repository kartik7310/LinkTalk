import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType | null = null;

  async initialize(): Promise<RedisClientType> {
    if (this.client) return this.client;

    try {
      this.client = createClient({ url: process.env.REDIS_URI });
      this.client.on("error", (error) => console.error("Redis Client Error:", error));
      await this.client.connect();
      console.log(" Redis Connected!");
      return this.client;
    } catch (error) {
      console.error(" Failed to initialize Redis:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.log(" Redis disconnected!");
    }
  }

  async _safe<T>(action: () => Promise<T>, fallback: T): Promise<T> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) return fallback;
    }

    try {
      return await action();
    } catch (error) {
      console.error("Redis error:", error);
      return fallback;
    }
  }

  async addUserSession(userId: string, socketId: string): Promise<void> {
    await this._safe(async () => {
      const key = `user:${userId}:sessions`;
      await this.client!.sAdd(key, socketId);
      await this.client!.expire(key, 600);
    }, undefined);
  }

  async getUserSessionsCount(userId: string): Promise<number> {
    return await this._safe(async () => {
      return this.client!.sCard(`user:${userId}:sessions`);
    }, 0);
  }

  async removeUserSession(userId: string, socketId: string): Promise<void> {
    await this._safe(async () => {
      const key = `user:${userId}:sessions`;
      await this.client!.sRem(key, socketId);
      const remaining = await this.getUserSessionsCount(userId);
      if (remaining === 0) await this.client!.del(key);
    }, undefined);
  }

  async removeAllUserSessions(userId: string): Promise<void> {
    await this._safe(async () => {
      await this.client!.del(`user:${userId}:sessions`);
    }, undefined);
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const count = await this.getUserSessionsCount(userId);
    return count > 0;
  }
}

export default new RedisService();
