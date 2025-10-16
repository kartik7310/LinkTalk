import express from "express";
import AuthController from "../controllers/AuthController.js";
import auth from "../middlewares/Auth.js";
const router = express.Router();


router.post("/signup",AuthController.register);
router.post("/login",AuthController.login);
router.get("/me",auth,AuthController.me);
router.get("/logout",AuthController.logout);


export default router;