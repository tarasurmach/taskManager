import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateField1704838493799 implements MigrationInterface {
    name = 'AddDateField1704838493799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`createdAt\``);
    }

}
