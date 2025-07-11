import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controller/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import LOGGER from "../config/logger";
import authentication from "../middlewares/authentication";
import { routeProtection } from "../middlewares/routeProtection";
import { ROLES } from "../constants";

const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);

const userController = new UserController(userService, LOGGER);

const router = express.Router();

router.get(
    "/",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getAll(req, res, next);
    },
);
router.get(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getById(req, res, next);
    },
);
router.post(
    "/",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    },
);
router.patch(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    },
);
router.delete(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.delete(req, res, next);
    },
);
