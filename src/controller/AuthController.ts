import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import fs from "fs";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ROLES } from "../constants";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import path from "path";
import { CONFIG } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";

import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import {
    ACCESS_TOKEN_EXPIRATION_TIME,
    ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_NAME,
} from "../constants/appConstants";
import { AuthRequest } from "../types";

export class AuthController {
    private userService: UserService;
    private logger: Logger;
    private credentialService: CredentialService;
    private tokenService: TokenService;

    constructor(
        userService: UserService,
        logger: Logger,
        credentialService: CredentialService,
        tokenService: TokenService,
    ) {
        this.userService = userService;
        this.logger = logger;
        this.credentialService = credentialService;
        this.tokenService = tokenService;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        try {
            const result = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: ROLES.CUSTOMER,
            });
            this.logger.info("User created successfully", { result });
            const accessToken = await this.tokenService.generateAccessToken(
                String(result.id),
            );

            const refreshTokenId =
                await this.tokenService.persistRefreshToken(result);

            const refreshToken = await this.tokenService.generateRefreshToken(
                String(result.id),
                String(refreshTokenId),
            );

            res.cookie(ACCESS_TOKEN_NAME, accessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: ACCESS_TOKEN_EXPIRATION_TIME, // 1 hour
            });
            res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: REFRESH_TOKEN_EXPIRATION_TIME, // 1 year
            });

            res.status(201).json({
                id: result.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            this.logger.error("Error creating user", { error });
            next(error);
            return;
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const errorData = createHttpError(401, "Invalid credentials");
                next(errorData);
                return;
            }

            const isPasswordValid =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );
            if (!isPasswordValid) {
                const errorData = createHttpError(401, "Invalid credentials");
                next(errorData);
                return;
            }

            const generateAccessToken =
                await this.tokenService.generateAccessToken(String(user.id));
            const refreshTokenId =
                await this.tokenService.persistRefreshToken(user);
            const refreshToken = await this.tokenService.generateRefreshToken(
                String(user.id),
                String(refreshTokenId),
            );
            res.cookie("accessToken", generateAccessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: ACCESS_TOKEN_EXPIRATION_TIME, // 1 hour
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: REFRESH_TOKEN_EXPIRATION_TIME, // 1 year
            });
            res.status(200).json({
                id: user.id,
                accessToken: generateAccessToken,
                refreshToken: refreshToken,
                message: "Login successful",
            });
        } catch (error) {
            this.logger.error("Error logging in", { error });
        }
    }

    async self(req: AuthRequest, res: Response, next: NextFunction) {
        const { id } = req.auth;

        try {
            const user = await this.userService.findById(Number(id));
            if (!user) {
                const createError = createHttpError(401, "User not found");
                next(createError);
                return;
            }
            res.status(200).json({
                ...user,
                password: undefined,
            });
        } catch (error) {
            this.logger.error("Error finding user", { error });
            next(error);
            return;
        }
    }
}

export default AuthController;
