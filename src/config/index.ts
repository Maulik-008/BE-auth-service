import { config } from "dotenv";

config();

export const CONFIG = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
    },
};
