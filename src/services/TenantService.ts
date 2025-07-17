import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { CreateTenantRequest, ITenant, TenantQueryParams } from "../types";
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
        return await this.tenantRepository.delete(id);
    }
    async getList(params: TenantQueryParams) {
        const { q, currentPage, perPage } = params;
        const searchTerm = `%${q}%`;

        const queryBuilder = this.tenantRepository.createQueryBuilder("Tenant");
        queryBuilder.where((qb) => {
            qb.where(`Tenant.name ILike :q`, { q: searchTerm });
        });

        return await queryBuilder
            .skip((currentPage - 1) * perPage)
            .take(perPage)
            .orderBy("Tenant.createdAt", "DESC")
            .getManyAndCount();
    }
    async findById(id: string | number | undefined | null = undefined) {
        return await this.tenantRepository.findOne({
            where: { id: Number(id) },
        });
    }
    async findByName(name: string) {
        return await this.tenantRepository.findOne({
            where: { name },
        });
    }
}
