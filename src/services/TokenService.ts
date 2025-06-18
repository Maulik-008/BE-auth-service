import { sign } from "jsonwebtoken";
import { CONFIG } from "../config";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import path from "path";
import fs from "fs";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    async generateAccessToken(userId: string) {
        let privateKey: Buffer;

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (error) {
            const e = createHttpError(500, "Error reading private key");
            throw e;
        }

        return sign({ id: userId }, privateKey, {
            expiresIn: "1h",
            algorithm: "RS256",
            issuer: "auth-service",
        });
    }
    async generateRefreshToken(userId: string, refreshTokenId: string) {
        return sign({ id: userId }, CONFIG.JWT.REFRESH_TOKEN_SECRET!, {
            expiresIn: "1y",
            algorithm: "HS256",
            issuer: "auth-service",
            jwtid: String(refreshTokenId),
        });
    }
    async persistRefreshToken(user: User) {
        return await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
    }
}
