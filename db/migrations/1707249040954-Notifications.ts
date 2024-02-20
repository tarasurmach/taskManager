import { MigrationInterface, QueryRunner } from "typeorm";

export class Notifications1707249040954 implements MigrationInterface {
    name = 'Notifications1707249040954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_30cb9d78297c1f2a2e07df1a616\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`authorId\` \`author_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_c86013b9e84159f67ccb38e77f7\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_c86013b9e84159f67ccb38e77f7\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`author_id\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_30cb9d78297c1f2a2e07df1a616\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
