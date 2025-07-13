import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { matchedData } from "express-validator";
import { UserQueryParams } from "../types";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, role } = req.body;
        try {
            const userExists = await this.userService.findByEmail(email);
            if (userExists) {
                next(
                    createHttpError(
                        400,
                        "User Already Exists with this same mail",
                    ),
                );
            }

            await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
            });
            res.status(201).json({
                message: "User Created Successfully",
            });
        } catch (err) {
            next(err);
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, role } = req.body;
        const userId = req.params.id;

        try {
            if (isNaN(Number(userId))) {
                next(createHttpError(400, "Invalid url param."));
                return;
            }
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                email,
                password,
                role,
            });

            res.status(200).json({
                messsage: "User Updated Successfully",
            });
        } catch (err) {
            next(err);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {}
    async getById(req: Request, res: Response, next: NextFunction) {}
    async getAll(req: Request, res: Response, next: NextFunction) {
        const validData = matchedData(req, {
            onlyValidData: true,
        }) as UserQueryParams;

        try {
            const [users, count] = await this.userService.getAll(
                validData as UserQueryParams,
            );
            res.status(200).json({
                data: users,
                currentPage: validData.currentPage,
                perPage: validData.perPage,
                total: count,
            });
        } catch (err) {
            next(err);
        }
    }
}
