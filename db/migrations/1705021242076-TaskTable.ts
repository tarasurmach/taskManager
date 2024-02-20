import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskTable1705021242076 implements MigrationInterface {
    name = 'TaskTable1705021242076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`dueDate\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_assignee\` (\`userId\` int NOT NULL, \`assigneeId\` int NOT NULL, INDEX \`IDX_e37b6055ee6a974336d8ae7b0c\` (\`userId\`), INDEX \`IDX_41ba5ed36909e11829095c6acb\` (\`assigneeId\`), PRIMARY KEY (\`userId\`, \`assigneeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_30cb9d78297c1f2a2e07df1a616\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_assignee\` ADD CONSTRAINT \`FK_e37b6055ee6a974336d8ae7b0cd\` FOREIGN KEY (\`userId\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`task_assignee\` ADD CONSTRAINT \`FK_41ba5ed36909e11829095c6acbb\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task_assignee\` DROP FOREIGN KEY \`FK_41ba5ed36909e11829095c6acbb\``);
        await queryRunner.query(`ALTER TABLE \`task_assignee\` DROP FOREIGN KEY \`FK_e37b6055ee6a974336d8ae7b0cd\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_30cb9d78297c1f2a2e07df1a616\``);
        await queryRunner.query(`DROP INDEX \`IDX_41ba5ed36909e11829095c6acb\` ON \`task_assignee\``);
        await queryRunner.query(`DROP INDEX \`IDX_e37b6055ee6a974336d8ae7b0c\` ON \`task_assignee\``);
        await queryRunner.query(`DROP TABLE \`task_assignee\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
