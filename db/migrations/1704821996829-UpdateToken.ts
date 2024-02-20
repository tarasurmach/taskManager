import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateToken1704821996829 implements MigrationInterface {
    name = 'UpdateToken1704821996829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` CHANGE \`token\` \`token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` CHANGE \`token\` \`token\` varchar(255) NOT NULL`);
    }

}
