import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1762308912283 implements MigrationInterface {
    name = 'CreateTables1762308912283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media_contents" ("media_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "category" "public"."media_contents_category_enum" NOT NULL, "thumbnail_url" character varying NOT NULL, "content_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0427ae0bfa5dc2703daee079272" PRIMARY KEY ("media_id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("rating_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "media_id" uuid NOT NULL, "stars" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc4f636dd0dd5a75e84115a606f" PRIMARY KEY ("rating_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "rating_count" integer, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_1aff61a3e5a6b74c2f5faaf6b54" FOREIGN KEY ("media_id") REFERENCES "media_contents"("media_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_1aff61a3e5a6b74c2f5faaf6b54"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "media_contents"`);
    }

}
