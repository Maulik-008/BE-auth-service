import { checkSchema } from "express-validator";
import { ROLES } from "../constants";

export const userValidator = checkSchema({
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
    firstName: {
        in: "body",
        isString: true,
        notEmpty: true,
        errorMessage: "Firstname is required",
    },
    lastName: {
        in: "body",
        isString: true,
        notEmpty: true,
        errorMessage: "LastName is required",
    },
    tenantId: {
        in: "body",
        isString: false,
        optional: true,
        customSanitizer: {
            options: (value) => {
                return value ? Number(value) : undefined;
            },
        },
    },
    role: {
        in: "body",
        isString: true,
        notEmpty: true,
        customSanitizer: {
            options: (value: string) => {
                const validRoles = [ROLES.CUSTOMER, ROLES.MANAGER];
                if (
                    !validRoles.includes(
                        value as typeof ROLES.CUSTOMER | typeof ROLES.MANAGER,
                    )
                ) {
                    throw new Error("Invalid role");
                }
                return value;
            },
        },
        errorMessage: "Role is required",
    },
});
