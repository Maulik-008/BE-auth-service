import { checkSchema } from "express-validator";
import { ROLES } from "../constants";

const listUserValidator = checkSchema(
    {
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);

                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
        q: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = value ? value : "";

                    return parsedValue;
                },
            },
        },
        role: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = [
                        ROLES.CUSTOMER,
                        ROLES.ADMIN,
                        ROLES.MANAGER,
                    ].includes(value)
                        ? value
                        : undefined;

                    return parsedValue;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
    },
    ["query"],
);

export default listUserValidator;
