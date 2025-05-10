import express from "express";
import AuthController from "../controller/AuthController";
const AuthRouter = express.Router();

const authController = new AuthController();

AuthRouter.post("/login", authController.login);

AuthRouter.post("/register", authController.register);

export default AuthRouter;
