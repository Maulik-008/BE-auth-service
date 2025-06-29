import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1751117993462 implements MigrationInterface {
    name = "RenameTables1751117993462";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("user", "users");
        await queryRunner.renameTable("refresh_token", "refresh_tokens");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("users", "user");
        await queryRunner.renameTable("refresh_tokens", "refresh_token");
    }
}
