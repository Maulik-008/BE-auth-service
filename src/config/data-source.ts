import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { CONFIG } from ".";
import { RefreshToken } from "../entity/RefreshToken";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB.HOST,
    port: parseInt(CONFIG.DB.PORT || "5432"),
    username: CONFIG.DB.USERNAME,
    password: CONFIG.DB.PASSWORD,
    database: CONFIG.DB.NAME,
    synchronize: false,
    logging: CONFIG.NODE_ENV === "dev",
    entities: [User, RefreshToken],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
