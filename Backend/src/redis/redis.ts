import { createClient ,RedisClientType } from "redis";

class RedisService {
  private client:RedisClientType |null = null
    constructor() {
        this.client = null;
    }

    async initialize() {  //initialize redis client
        if (this.client) return;

        try {
            this.client = createClient({
                url: process.env.REDIS_URI,
            })

            this.client.on("error", (error) => console.error("Redis Client Error", error));

            await this.client.connect();
            console.log("Redis Connected!");

        } catch (error) {
            console.error("Failed to initialize redis", error);
        }
    }
     async disconnect() { //disconnect redis
        if (this.client) {
            await this.client.quit();
            this.client = null;
            console.log("Redis disconnected!");
        }
    }

     async _safe(action:any, fallback = null) { //If Redis isn’t connected, it auto-connects.

        if (!this.client) {
            await this.initialize();
            if (!this.client) return fallback;
        }

        try {
            return await action();
        } catch (error) {
            console.error("Redis error", error);
            return fallback;
        }
    }
    
  }
  export default new RedisService();