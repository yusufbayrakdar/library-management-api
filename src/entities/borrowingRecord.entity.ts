import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm'

import Book from './book.entity'
import User from './user.entity'

@Entity()
@Index('idx_book_and_record_returned_at', ['book', 'returnedAt'])
@Index('idx_user_and_book_and_returned_at', ['user', 'book', 'returnedAt'])
export class BorrowingRecord {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, (user) => user.borrowingRecords, { onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => Book, (book) => book.borrowingRecords, { onDelete: 'CASCADE' })
	book: Book

	@Column({ type: 'float', nullable: true })
	userScore: number

	@Column({ type: 'timestamp', nullable: true })
	returnedAt: Date

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date
}
