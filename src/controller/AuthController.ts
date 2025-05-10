import { Request, Response } from "express";

export class AuthController {
    register(req: Request, res: Response) {
        res.status(201).send("Hello World");
    }

    login(req: Request, res: Response) {
        res.status(200).send("Hello World");
    }
}

export default AuthController;
