import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialDatabase1736731113298 implements MigrationInterface {
	name = 'InitialDatabase1736731113298'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "score" double precision, "rawScore" double precision, "borrowedCount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_233978864a48c44d3fcafe01573" UNIQUE ("name"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "borrowing_record" ("id" SERIAL NOT NULL, "userScore" double precision, "returnedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "bookId" integer, CONSTRAINT "PK_1c8d1f38cf36f4ef99f11bed784" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "idx_user_and_book_and_returned_at" ON "borrowing_record" ("userId", "bookId", "returnedAt") `,
		)
		await queryRunner.query(
			`CREATE INDEX "idx_book_and_record_returned_at" ON "borrowing_record" ("bookId", "returnedAt") `,
		)
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "borrowing_record" ADD CONSTRAINT "FK_6f908a298bbd227fa44fc84f9f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "borrowing_record" ADD CONSTRAINT "FK_8f94a0c681d9bb08526037b0cea" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "borrowing_record" DROP CONSTRAINT "FK_8f94a0c681d9bb08526037b0cea"`)
		await queryRunner.query(`ALTER TABLE "borrowing_record" DROP CONSTRAINT "FK_6f908a298bbd227fa44fc84f9f8"`)
		await queryRunner.query(`DROP TABLE "user"`)
		await queryRunner.query(`DROP INDEX "public"."idx_book_and_record_returned_at"`)
		await queryRunner.query(`DROP INDEX "public"."idx_user_and_book_and_returned_at"`)
		await queryRunner.query(`DROP TABLE "borrowing_record"`)
		await queryRunner.query(`DROP TABLE "book"`)
	}
}
