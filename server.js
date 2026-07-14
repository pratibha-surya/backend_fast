import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import startEmailWorker from "./workers/email.worker.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);
    console.log("🔌 Socket.io initialized successfully");

    try {
      await connectRedis();
      // Start BullMQ worker after successful Redis connection
      startEmailWorker();
      console.log("📥 BullMQ Email Worker started successfully");
    } catch (redisError) {
      console.log("⚠️ Redis not running. Running server without caching and background workers.");
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

 startServer();