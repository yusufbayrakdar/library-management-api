import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { BorrowingRecord } from './borrowingRecord.entity'

@Entity()
export default class Book {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255, unique: true })
	name: string

	@Column({ type: 'float', nullable: true })
	score: number

	@Column({ type: 'float', nullable: true })
	rawScore: number

	@Column({ type: 'integer', default: 0 })
	borrowedCount: number

	@OneToMany(() => BorrowingRecord, (record) => record.book)
	borrowingRecords: BorrowingRecord[]

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
	updatedAt: Date

	@BeforeUpdate()
	async beforeUpdate() {
		if (typeof this.rawScore === 'number') {
			this.score = Number(this.rawScore.toFixed(2))
		}
	}
}

export type BookFields = Array<keyof Book>
export const BookSelectOptions = {
	list: ['id', 'name'] as BookFields,
	detail: ['id', 'name', 'score'] as BookFields,
}
