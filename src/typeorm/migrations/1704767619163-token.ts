import { MigrationInterface, QueryRunner } from "typeorm";

export class Token1704767619163 implements MigrationInterface {
    name = 'Token1704767619163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_f4ca2c1e7c96ae6e8a7cca9df8\` (\`email\`, \`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_94f168faad896c0786646fa3d4a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_94f168faad896c0786646fa3d4a\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_f4ca2c1e7c96ae6e8a7cca9df8\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
