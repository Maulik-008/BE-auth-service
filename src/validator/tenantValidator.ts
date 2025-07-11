import { checkSchema } from "express-validator";

export const tenantValidator = checkSchema({
    name: {
        isEmail: false,
        in: "body",
        isString: true,
        notEmpty: true,
        trim: true,
        errorMessage: "Name is required",
    },
    address: {
        in: "body",
        isString: true,
        notEmpty: true,
        errorMessage: "Address is required",
        isLength: {
            options: { min: 5 },
            errorMessage: "Address must be at least 5 characters long",
        },
    },
});
