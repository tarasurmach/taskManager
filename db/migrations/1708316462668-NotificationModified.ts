import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationModified1708316462668 implements MigrationInterface {
    name = 'NotificationModified1708316462668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_6bbc967a28c18cce99028fd4327\``);
        await queryRunner.query(`ALTER TABLE \`notification_read\` DROP FOREIGN KEY \`FK_5a483ac1b36b14665508040c9fe\``);
        await queryRunner.query(`ALTER TABLE \`notification_read\` DROP FOREIGN KEY \`FK_f4ca2411c43e4fb23215bf064be\``);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_c210f9da7823107c6a76dbff986\` FOREIGN KEY (\`sender\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read\` ADD CONSTRAINT \`FK_c598311479c986a3a6770b0241e\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read\` ADD CONSTRAINT \`FK_d5df1cea370b4e7a986b554a68d\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification_read\` DROP FOREIGN KEY \`FK_d5df1cea370b4e7a986b554a68d\``);
        await queryRunner.query(`ALTER TABLE \`notification_read\` DROP FOREIGN KEY \`FK_c598311479c986a3a6770b0241e\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_c210f9da7823107c6a76dbff986\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`notification_read\` ADD CONSTRAINT \`FK_f4ca2411c43e4fb23215bf064be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read\` ADD CONSTRAINT \`FK_5a483ac1b36b14665508040c9fe\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_6bbc967a28c18cce99028fd4327\` FOREIGN KEY (\`sender\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
