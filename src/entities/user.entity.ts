import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { BorrowingRecord } from './borrowingRecord.entity'

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255, unique: true })
	name: string

	@OneToMany(() => BorrowingRecord, (record) => record.user)
	borrowingRecords: BorrowingRecord[]

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
	updatedAt: Date
}

export type UserFields = Array<keyof Omit<typeof User.prototype, 'setValues'>>
export const UserSelectOptions = {
	list: ['id', 'name'] as UserFields,
	detail: ['id', 'name', 'borrowingRecords'] as UserFields,
}
