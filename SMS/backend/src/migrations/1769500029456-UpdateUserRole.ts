import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRole1769500029456 implements MigrationInterface {
    name = 'UpdateUserRole1769500029456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."UserData_role_enum" RENAME TO "UserData_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."UserData_role_enum" AS ENUM('Student', 'Teacher', 'Admin', 'User')`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" TYPE "public"."UserData_role_enum" USING "role"::"text"::"public"."UserData_role_enum"`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" SET DEFAULT 'User'`);
        await queryRunner.query(`DROP TYPE "public"."UserData_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."UserData_role_enum_old" AS ENUM('Student', 'Teacher', 'Admin')`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" TYPE "public"."UserData_role_enum_old" USING "role"::"text"::"public"."UserData_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "UserData" ALTER COLUMN "role" SET DEFAULT 'Student'`);
        await queryRunner.query(`DROP TYPE "public"."UserData_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."UserData_role_enum_old" RENAME TO "UserData_role_enum"`);
    }

}
