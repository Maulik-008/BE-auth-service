import { expressjwt, Request } from "express-jwt";
import { CONFIG } from "../config";
import { REFRESH_TOKEN_NAME } from "../constants/appConstants";

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
});
