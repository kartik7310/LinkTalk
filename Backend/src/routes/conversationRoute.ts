import express from "express";
import ConversationController from "../controllers/conversationController.js";
import auth from "../middlewares/Auth.js";

const router = express.Router();


router.post("/check-connection-code",auth,ConversationController.checkConnectCode);
router.get("/",auth,ConversationController.getConversation);

export default router;