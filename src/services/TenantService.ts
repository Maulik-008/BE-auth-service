import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { CreateTenantRequest, ITenant } from "../types";
import { NextFunction, Response } from "express";
import createHttpError from "http-errors";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create({ name, address }: ITenant) {
        try {
            const result = await this.tenantRepository.save({
                name,
                address,
            });
            return result;
        } catch (error) {
            throw createHttpError(400, "Failed to create tenant");
        }
    }
    async update({
        id,
        name,
        address,
    }: {
        id: number;
        name: string;
        address: string;
    }) {
        try {
            await this.tenantRepository.update(id, {
                name,
                address,
            });
        } catch (error) {
            throw createHttpError(400, "Failed to update tenant");
        }
    }
    async delete(id: number) {
        try {
            const tenant = await this.findById(id);
            if (!tenant) {
                throw new Error("Tenant not found");
            }
            await this.tenantRepository.delete(id);
        } catch (error) {
            throw createHttpError(400, "Failed to delete tenant");
        }
    }
    async getList(
        req: CreateTenantRequest,
        res: Response,
        next: NextFunction,
    ) {}
    async findById(id: string | number | undefined | null = undefined) {
        try {
            if (!id) {
                throw new Error("ID is required to find Tenant");
            }

            const result = await this.tenantRepository.findOne({
                where: { id: Number(id) },
            });

            return result;
        } catch (error) {
            throw new Error("Failed to find Tenant by ID");
        }
    }
    async findByName(name: string) {
        try {
            const result = await this.tenantRepository.findOne({
                where: { name },
            });

            return result;
        } catch (error) {
            throw new Error("Failed to find Tenant");
        }
    }
}
