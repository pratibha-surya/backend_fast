import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 2) {
        // Stop retrying after 2 attempts to prevent infinite terminal logging
        return false;
      }
      return 1000 * (retries + 1);
    },
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err.message);
});

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;