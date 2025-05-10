import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

export const CONFIG = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB: {
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        USERNAME: process.env.DB_USERNAME,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME,
    },
};
