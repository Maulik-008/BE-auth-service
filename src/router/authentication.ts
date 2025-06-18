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
import { registerValidator } from "../validator/registerValidator";
import { loginValidator } from "../validator/loginValidator";
import { CredentialService } from "../services/CredentialService";
import { RefreshToken } from "../entity/RefreshToken";
import { TokenService } from "../services/TokenService";
import authentication from "../middlewares/authentication";
import { AuthRequest } from "../types";
const AuthRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const authService = new UserService(userRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    authService,
    LOGGER,
    credentialService,
    tokenService,
);

AuthRouter.post("/login", loginValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.login(req, res, next);
}) as unknown as RequestHandler);

AuthRouter.post("/register", registerValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next);
}) as unknown as RequestHandler);

AuthRouter.get("/self", authentication, (async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    await authController.self(req, res, next);
}) as unknown as RequestHandler);

export default AuthRouter;
