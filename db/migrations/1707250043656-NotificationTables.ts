import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTables1707250043656 implements MigrationInterface {
    name = 'NotificationTables1707250043656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`sender\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_read_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_read\` tinyint NOT NULL DEFAULT 0, \`user_id\` int NULL, \`notification_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_user\` (\`user_id\` int NOT NULL, \`notification_id\` int NOT NULL, INDEX \`IDX_549f25e238a1be8a4ed7ec0ac3\` (\`user_id\`), INDEX \`IDX_cc974855ce8c702dfed67deaaa\` (\`notification_id\`), PRIMARY KEY (\`user_id\`, \`notification_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification_entity\` ADD CONSTRAINT \`FK_6bbc967a28c18cce99028fd4327\` FOREIGN KEY (\`sender\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read_entity\` ADD CONSTRAINT \`FK_f4ca2411c43e4fb23215bf064be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read_entity\` ADD CONSTRAINT \`FK_5a483ac1b36b14665508040c9fe\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_user\` ADD CONSTRAINT \`FK_549f25e238a1be8a4ed7ec0ac33\` FOREIGN KEY (\`user_id\`) REFERENCES \`notification_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`notification_user\` ADD CONSTRAINT \`FK_cc974855ce8c702dfed67deaaa7\` FOREIGN KEY (\`notification_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification_user\` DROP FOREIGN KEY \`FK_cc974855ce8c702dfed67deaaa7\``);
        await queryRunner.query(`ALTER TABLE \`notification_user\` DROP FOREIGN KEY \`FK_549f25e238a1be8a4ed7ec0ac33\``);
        await queryRunner.query(`ALTER TABLE \`notification_read_entity\` DROP FOREIGN KEY \`FK_5a483ac1b36b14665508040c9fe\``);
        await queryRunner.query(`ALTER TABLE \`notification_read_entity\` DROP FOREIGN KEY \`FK_f4ca2411c43e4fb23215bf064be\``);
        await queryRunner.query(`ALTER TABLE \`notification_entity\` DROP FOREIGN KEY \`FK_6bbc967a28c18cce99028fd4327\``);
        await queryRunner.query(`DROP INDEX \`IDX_cc974855ce8c702dfed67deaaa\` ON \`notification_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_549f25e238a1be8a4ed7ec0ac3\` ON \`notification_user\``);
        await queryRunner.query(`DROP TABLE \`notification_user\``);
        await queryRunner.query(`DROP TABLE \`notification_read_entity\``);
        await queryRunner.query(`DROP TABLE \`notification_entity\``);
    }

}
