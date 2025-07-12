import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import LOGGER from "./config/logger";
import AuthRouter from "./router/authentication";
import path from "path";
import fs from "fs";
import TenantRouter from "./router/tenant";

const APP = express();

APP.use(
    cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    }),
);
// Use absolute path for static files
APP.use(express.static(path.join(__dirname, "../public")));
APP.use(cookieParser());
APP.use(express.json());

APP.get("/", (req, res, next) => {
    const error = createHttpError(400, "Bad Request");
    next(error);
});

APP.use("/auth", AuthRouter);
APP.use("/tenant", TenantRouter);

// Explicitly serve the JWKS file
APP.get("/.well-known/jwks.json", (req, res) => {
    const jwksPath = path.join(__dirname, "../public/.well-known/jwks.json");

    // Read file directly and send as JSON
    try {
        const jwksContent = fs.readFileSync(jwksPath, "utf8");
        res.setHeader("Content-Type", "application/json");
        res.send(jwksContent);
    } catch (err) {
        console.error("Error reading JWKS file:", err);
        res.status(500).send("Error serving JWKS file");
    }
});

APP.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// Error handling middleware
APP.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    LOGGER.error(err.message);
    res.status(err.status || err.statusCode || 500).json({
        errors: [
            {
                path: "",
                message: err.message,
                type: err.name,
                location: "",
            },
        ],
    });
});

export default APP;
