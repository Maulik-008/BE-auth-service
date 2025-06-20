import { expressjwt, Request } from "express-jwt";
import { CONFIG } from "../config";
import { REFRESH_TOKEN_NAME } from "../constants/appConstants";
import { RefreshToken } from "../entity/RefreshToken";
import { AppDataSource } from "../config/data-source";
import { JwtPayload } from "jsonwebtoken";
import LOGGER from "../config/logger";

export default expressjwt({
    secret: CONFIG.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],
    getToken: (req: Request) => {
        const token = req.cookies[REFRESH_TOKEN_NAME];
        if (token) {
            return token;
        }
        return undefined;
    },
    isRevoked: async (_, token: JwtPayload | undefined) => {
        try {
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepository.findOne({
                where: {
                    id: Number(token?.payload?.id),
                    user: { id: Number(token?.payload?.sub) },
                },
            });

            return refreshToken === null;
        } catch (error) {
            LOGGER.error("Error validating refresh token", {
                id: token?.payload?.id,
                sub: token?.payload?.sub,
                error,
            });
        }
        return true;
    },
});
