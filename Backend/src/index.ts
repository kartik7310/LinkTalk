import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "./utils/logger.js";
import AuthRoute from "./routes/authRoute.js"
import errorHandler from "./middlewares/ErrorHandler.js";
import connectionDatabase from "./config/db.js";
import conversation from "./routes/conversationRoute.js"
const app = express();
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

app.get("/", (req, res) => {
  res.send("Hello TypeScript Backend!");
});

app.use('/api/v1/auth',AuthRoute)
app.use('/api/v1/chat',conversation)
app.use(errorHandler);

async function startServer() {
  try {
    await connectionDatabase()
    logger.info("🟢 Connected to DB");
    app.listen(PORT, () =>
      logger.info(`🚀 Server is running at http://localhost:${PORT}`)
    );
  } catch (err: any) {
    logger.error("🔴 Failed to start server:", err.message);
    process.exit(1);
  }
}
startServer();