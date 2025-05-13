import express from "express";
import AuthController from "../controller/AuthController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import LOGGER from "../config/logger";
const AuthRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new UserService(userRepository);
const authController = new AuthController(authService, LOGGER);

AuthRouter.post("/login", authController.login);

AuthRouter.post("/register", authController.register);

export default AuthRouter;
