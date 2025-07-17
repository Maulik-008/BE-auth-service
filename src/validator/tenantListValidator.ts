import { checkSchema } from "express-validator";

export const tenantListValidator = checkSchema(
    {
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    return value && !Number.isNaN(value) ? Number(value) : 1;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    return value && !Number.isNaN(value) ? Number(value) : 10;
                },
            },
        },
        q: {
            customSanitizer: {
                options: (value) => (value ? String(value) : ""),
            },
        },
    },
    ["query"],
);
