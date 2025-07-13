import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controller/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import LOGGER from "../config/logger";
import authentication from "../middlewares/authentication";
import { routeProtection } from "../middlewares/routeProtection";
import { ROLES } from "../constants";
import listUserValidator from "../validator/listUserValidator";

const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);

const userController = new UserController(userService, LOGGER);

const UserRouter = express.Router();

UserRouter.get(
    "/",
    authentication,
    listUserValidator,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getAll(req, res, next);
    },
);
UserRouter.get(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getById(req, res, next);
    },
);
UserRouter.post(
    "/",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    },
);
UserRouter.patch(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    },
);
UserRouter.delete(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.delete(req, res, next);
    },
);

export default UserRouter;
