import Book from '../../entities/book.entity'

export type BorrowBookParams = {
	userId: number
	bookId: number
	sleepSec?: number
}

export type ReturnBookParams = {
	userId: number
	bookId: number
	score: number
}

export type PrepareNewScorePaylaod = {
	book: Book
	score: number
	previousUserScore?: number
}
