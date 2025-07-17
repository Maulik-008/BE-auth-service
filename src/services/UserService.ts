import { Brackets, Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData, UserQueryParams } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email },
            });
            if (existingUser) {
                throw createHttpError(400, "User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
            return result;
        } catch (error) {
            const errorData = createHttpError(500, "Failed to create user");
            throw errorData;
        }
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        return user;
    }
    async findByEmailPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "email",
                "password",
                "role",
                "firstName",
                "lastName",
            ],
        });

        return user;
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: { tenant: true },
            select: { tenant: { id: true, name: true } },
        });
    }

    async update(id: number, payload: Partial<UserData>) {
        try {
            const isUserExists = await this.findById(id);
            if (!isUserExists) {
                throw createHttpError(400, "User is not Exits with this id");
            }
            return await this.userRepository.update({ id }, payload);
        } catch (error) {
            error = createHttpError(500, "Failed to update user");
            throw error;
        }
    }
    async delete(id: number) {
        return await this.userRepository.delete(id);
    }
    async getAll(params: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder("user");

        const searchTerm = `%${params.q}%`;
        queryBuilder.where(
            new Brackets((qb) => {
                qb.where(
                    "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                    { q: searchTerm },
                ).orWhere("user.email ILike :q", { q: searchTerm });
            }),
        );

        if (params.role) {
            queryBuilder.andWhere("user.role=:role", { role: params.role });
        }

        return await queryBuilder
            .leftJoinAndSelect("user.tenant", "tenant")
            .skip((params.currentPage - 1) * params.perPage)
            .take(params.perPage)
            .orderBy("user.id", "DESC")
            .getManyAndCount();
    }
}
