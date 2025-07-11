import express, {
    NextFunction,
    RequestHandler,
    Request,
    Response,
} from "express";

import { TenantService } from "../services/TenantService";
import { AuthRequest, CreateTenantRequest } from "../types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        logger: Logger,
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({ errors: error.array() });
            }

            const isExistingTenantWithSameName =
                await this.tenantService.findByName(name);

            if (isExistingTenantWithSameName) {
                next(
                    createHttpError(
                        400,
                        "Tenant with this name already exists",
                    ),
                );
                return;
            }
            const result = await this.tenantService.create({
                name,
                address,
            });

            res.status(201).json({
                message: "Tenant created successfully",
                data: result.id,
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, address } = req.body;
            const { id } = req.params;

            const error = validationResult(req);
            if (!error.isEmpty()) {
                res.status(400).json({ errors: error.array() });
            }

            const getById = await this.tenantService.findById(id);
            if (!getById) {
                next(createHttpError(404, "Tenant not found"));
            }
            const checkFindByName = await this.tenantService.findByName(name);

            if (checkFindByName && checkFindByName.id !== Number(id)) {
                return res.status(400).json({
                    message: "Tenant with this name already exists",
                });
            }

            await this.tenantService.update({
                id: Number(id),
                name,
                address,
            });

            res.status(200).json({
                message: "Tenant updated successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            await this.tenantService.delete(Number(id));
            res.status(200).json({
                message: "Tenant deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    async getList(req: CreateTenantRequest, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                message: "Tenant list fetched successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {}
}
