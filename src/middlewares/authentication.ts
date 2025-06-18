import { expressjwt } from "express-jwt";
import jwksClient from "jwks-rsa";
import { CONFIG } from "../config";
import {
    ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME,
} from "../constants/appConstants";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: CONFIG.JWKS_URI!,
    }),
    algorithms: ["RS256"],
    getToken: (req) => {
        const authHeader = req.headers.authorization;
        if (
            authHeader &&
            authHeader.startsWith("Bearer ") &&
            authHeader.split(" ")[1] !== "undefined"
        ) {
            return authHeader.split(" ")[1];
        }

        const token = req.cookies[ACCESS_TOKEN_NAME];
        if (token) {
            return token;
        }
        return undefined;
    },
});
