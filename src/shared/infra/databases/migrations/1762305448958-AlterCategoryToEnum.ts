import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCategoryToEnum1762305448958 implements MigrationInterface {
    name = 'AlterCategoryToEnum1762305448958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_contents" DROP COLUMN "category"`);
        await queryRunner.query(`CREATE TYPE "public"."media_contents_category_enum" AS ENUM('game', 'video', 'artwork', 'music')`);
        await queryRunner.query(`ALTER TABLE "media_contents" ADD "category" "public"."media_contents_category_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_contents" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."media_contents_category_enum"`);
        await queryRunner.query(`ALTER TABLE "media_contents" ADD "category" character varying NOT NULL`);
    }

}
