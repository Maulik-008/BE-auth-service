import { config } from "dotenv";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

export const CONFIG = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DB: {
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        USERNAME: process.env.DB_USERNAME,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME,
    },
    JWT: {
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    },
    JWKS_URI: process.env.JWKS_URI,
};
