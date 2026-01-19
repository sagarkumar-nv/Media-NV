import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser11768824664617 implements MigrationInterface {
    name = 'CreateUser11768824664617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usersnew" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_831ebcab858522bba7aff72e83f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2d704bd8fcfb0ef76c85272749" ON "usersnew" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2d704bd8fcfb0ef76c85272749"`);
        await queryRunner.query(`DROP TABLE "usersnew"`);
    }

}
