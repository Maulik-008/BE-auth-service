import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { CONFIG } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB.HOST,
    port: parseInt(CONFIG.DB.PORT || "5432"),
    username: CONFIG.DB.USERNAME,
    password: CONFIG.DB.PASSWORD,
    database: CONFIG.DB.NAME,
    synchronize: CONFIG.NODE_ENV === "dev",
    logging: CONFIG.NODE_ENV === "dev",
    entities: [User],
    migrations: [],
    subscribers: [],
});
