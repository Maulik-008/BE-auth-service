import { DataSource } from "typeorm";

export const truncateTables = async (dataSource: DataSource) => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJWT = (token: string | null): boolean => {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            const buffer = Buffer.from(part, "base64").toString("utf-8");
            if (buffer.length !== part.length) {
                throw new Error("Invalid JWT");
            }
        });
        return true;
    } catch (error) {
        return false;
    }
};
