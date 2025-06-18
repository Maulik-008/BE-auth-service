import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password, role }: UserData) {
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
            });
            return result;
        } catch (error) {
            const errorData = createHttpError(500, "Failed to create user");
            throw errorData;
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });

            return user;
        } catch (error) {
            const errorData = createHttpError(500, "Failed to find user");
            throw errorData;
        }
    }
}
