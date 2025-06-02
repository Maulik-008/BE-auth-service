import express, {
    NextFunction,
    RequestHandler,
    Request,
    Response,
} from "express";
import AuthController from "../controller/AuthController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import LOGGER from "../config/logger";
const AuthRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new UserService(userRepository);
const authController = new AuthController(authService, LOGGER);

AuthRouter.post("/login", (async (req: Request, res: Response) => {
    await authController.login(req, res);
}) as unknown as RequestHandler);

AuthRouter.post("/register", (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next);
}) as unknown as RequestHandler);

export default AuthRouter;
