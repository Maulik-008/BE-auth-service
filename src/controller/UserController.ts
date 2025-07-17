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
        const { firstName, lastName, email, password, role, tenantId } =
            req.body;
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
                tenantId,
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
    async delete(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        const getUserId = await this.userService.findById(Number(userId));

        if (!getUserId) {
            next(createHttpError(400, "Id not Exists"));
        }

        try {
            await this.userService.delete(Number(userId));

            this.logger.info("User has been deleted", {
                id: Number(userId),
            });
            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
        const getId = req.params.id;
        try {
            if (getId) {
                const getUser = await this.userService.findById(Number(getId));

                res.status(200).json({
                    message: "User Fetched Successfully",
                    data: getUser,
                });
            } else {
                const err = createHttpError(400, "Please Provide Proper ID");
                next(err);
            }
        } catch (err) {
            next(err);
        }
    }
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
