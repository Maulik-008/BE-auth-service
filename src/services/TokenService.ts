import { sign, verify } from "jsonwebtoken";
import { CONFIG } from "../config";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import path from "path";
import fs from "fs";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    async generateAccessToken(payload: {
        sub: string;
        role: string;
        name: string;
    }) {
        let privateKey: Buffer;

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (error) {
            const e = createHttpError(500, "Error reading private key");
            throw e;
        }

        return sign(payload, privateKey, {
            expiresIn: "1h",
            algorithm: "RS256",
            issuer: "auth-service",
        });
    }
    async generateRefreshToken(payload: { sub: string; id: string }) {
        return sign(payload, CONFIG.JWT.REFRESH_TOKEN_SECRET!, {
            expiresIn: "1y",
            algorithm: "HS256",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });
    }
    async persistRefreshToken(user: User) {
        return await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
    }

    async deleteRefreshToken(id: string) {
        return await this.refreshTokenRepository.delete(Number(id));
    }
}
