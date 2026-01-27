import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchoolSchema1769493241374 implements MigrationInterface {
    name = 'InitSchoolSchema1769493241374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "section" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "teacher_id" uuid, CONSTRAINT "PK_c40ccdf38be3986bdc392ea428b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rollno" character varying NOT NULL, "grade" character varying NOT NULL, "user_id" uuid, "class_id" uuid, CONSTRAINT "REL_fb3eff90b11bddf7285f9b4e28" UNIQUE ("user_id"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."UserData_role_enum" AS ENUM('Student', 'Teacher', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "UserData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."UserData_role_enum" NOT NULL DEFAULT 'Student', "gender" character varying, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "teacherId" uuid, CONSTRAINT "UQ_fde5e53ba8df0f63379b42aeb3c" UNIQUE ("email"), CONSTRAINT "REL_f0847d81dcf918eec24bffc6d8" UNIQUE ("studentId"), CONSTRAINT "REL_c22564dd59ea0347004ec33522" UNIQUE ("teacherId"), CONSTRAINT "PK_910ead3c6c143bcc2a3cd31caa6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Classes" ADD CONSTRAINT "FK_9924636b6df22a73b93a206cce0" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281" FOREIGN KEY ("user_id") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_de6ad4ae6936dce474e2823984e" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserData" ADD CONSTRAINT "FK_f0847d81dcf918eec24bffc6d83" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserData" ADD CONSTRAINT "FK_c22564dd59ea0347004ec33522f" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserData" DROP CONSTRAINT "FK_c22564dd59ea0347004ec33522f"`);
        await queryRunner.query(`ALTER TABLE "UserData" DROP CONSTRAINT "FK_f0847d81dcf918eec24bffc6d83"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_de6ad4ae6936dce474e2823984e"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281"`);
        await queryRunner.query(`ALTER TABLE "Classes" DROP CONSTRAINT "FK_9924636b6df22a73b93a206cce0"`);
        await queryRunner.query(`DROP TABLE "UserData"`);
        await queryRunner.query(`DROP TYPE "public"."UserData_role_enum"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "Classes"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
    }

}
