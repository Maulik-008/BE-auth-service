import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import LOGGER from "./config/logger";
import AuthRouter from "./router/authentication";

const APP = express();

APP.get("/", (req, res, next) => {
    const error = createHttpError(400, "Bad Request");
    next(error);
});

APP.use("/auth", AuthRouter);

// Error handling middleware
APP.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    LOGGER.error(err.message);
    res.status(err.status || 500).json({
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
