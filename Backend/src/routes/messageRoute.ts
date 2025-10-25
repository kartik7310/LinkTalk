import express from "express";

import auth from "../middlewares/Auth.js";
import MessageController from "../controllers/MessageController.js";

const router = express.Router();


router.get("/:conversationId/message",auth,MessageController.getMessage);

export default router;