import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ROLES } from "../constants";

export class AuthController {
    private userService: UserService;
    private logger: Logger;

    constructor(userService: UserService, logger: Logger) {
        this.userService = userService;
        this.logger = logger;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;

        try {
            const result = await this.userService.create({
                firstName,
                lastName,
                email,
                password: "***",
                role: ROLES.CUSTOMER,
            });
            this.logger.info("User created successfully", { result });
            res.status(201).json({ id: result.id });
        } catch (error) {
            this.logger.error("Error creating user", { error });
            next(error);
            return;
        }
    }

    login(req: Request, res: Response) {
        res.status(200).send("Hello World");
    }
}

export default AuthController;
