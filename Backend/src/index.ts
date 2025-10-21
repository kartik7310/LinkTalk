import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from 'node:http';
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "./utils/logger.js";
import AuthRoute from "./routes/authRoute.js"
import errorHandler from "./middlewares/ErrorHandler.js";
import connectionDatabase from "./config/db.js";
import conversation from "./routes/conversationRoute.js"
import { initlizeSocket } from "./socket.js";
import { socketAuthMiddleware } from "./socket/socketAuthMiddleware.js";
const app = express();
const httpServer = createServer(app)
dotenv.config();  
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin:process.env.FRONTEND_URL,
    methods: ["GET,PUT,POST,DELETE"],
    credentials: true,
  })
);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 60000,
})  

io.use(socketAuthMiddleware)
//socket

await initlizeSocket(io)

app.get("/", (req, res) => {
  res.send("Hello TypeScript Backend!");
});

app.use('/api/v1/auth',AuthRoute)
app.use('/api/v1/conversation',conversation)
app.use(errorHandler);

async function startServer() {
  try {
    await connectionDatabase()
    logger.info("🟢 Connected to DB");
    httpServer.listen(PORT, () =>
      logger.info(`🚀 Server is running at http://localhost:${PORT}`)
    );  
  } catch (err: any) {
    logger.error("🔴 Failed to start server:", err.message);
    process.exit(1);
  }
}
startServer();