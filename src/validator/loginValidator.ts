import { checkSchema } from "express-validator";

export const loginValidator = checkSchema({
    email: {
        isEmail: true,
        in: "body",
        isString: true,
        notEmpty: true,
        trim: true,
        errorMessage: "Email is required",
    },
    password: {
        in: "body",
        isString: true,
        notEmpty: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters long",
        },
    },
});
