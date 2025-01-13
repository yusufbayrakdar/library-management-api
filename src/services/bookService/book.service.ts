import moment from 'moment'
import { IsNull, Not } from 'typeorm'

import { BorrowBookParams, PrepareNewScorePaylaod, ReturnBookParams } from './book.service.types'
import { BookSelectOptions } from '../../entities/book.entity'
import bookRepository from '../../repositories/bookRepository/book.repository'
import borrowingRecordRepository from '../../repositories/borrowingRecord.ts/borrowingRecord.repository'
import userRepository from '../../repositories/userRepository/user.repository'
import { AppError } from '../../utils/appError/appError'
import ERROR_MESSAGES from '../../utils/constants/errorMessages/errorMessages'
import dbConnection from '../../utils/dbConnection'
import borrowingRecordService from '../borrowingRecordService/borrowingRecord.service'

const getBooks = async () => {
	return bookRepository.find({ select: BookSelectOptions.list })
}

const getBook = async (id: number) => {
	const book = await bookRepository.findOne({ where: { id }, select: BookSelectOptions.detail })
	if (!book) throw new AppError({ message: ERROR_MESSAGES['BK-001'], status: 404 })
	if (typeof book.score !== 'number') book.score = -1

	return book
}

const createBook = async (name: string) => {
	const bookExists = await bookRepository.findOne({ where: { name } })
	if (bookExists) throw new AppError({ message: ERROR_MESSAGES['BK-002'] })

	return bookRepository.create(name)
}

const borrowBook = async (params: BorrowBookParams) => {
	const { userId, bookId } = params

	const user = await userRepository.findOne({ where: { id: userId } })
	if (!user) throw new AppError({ message: ERROR_MESSAGES['USR-001'], status: 404 })

	const book = await bookRepository.findOne({ where: { id: bookId } })
	if (!book) throw new AppError({ message: ERROR_MESSAGES['BK-001'], status: 404 })

	const isBookUnavailable = await borrowingRecordRepository.findOne({
		where: { book: { id: book.id }, returnedAt: IsNull() },
	})
	if (isBookUnavailable) throw new AppError({ message: ERROR_MESSAGES['BK-003'], status: 409 })

	await borrowingRecordRepository.create({ user, book })
}

const returnBook = async (params: ReturnBookParams) => {
	const { userId, bookId, score } = params

	const user = await userRepository.findOne({ where: { id: userId } })
	if (!user) throw new AppError({ message: ERROR_MESSAGES['USR-001'], status: 404 })

	const book = await bookRepository.findOne({ where: { id: bookId } })
	if (!book) throw new AppError({ message: ERROR_MESSAGES['BK-001'], status: 404 })

	const borrowingRecord = await borrowingRecordRepository.findOne({
		where: { book: { id: book.id }, returnedAt: IsNull() },
		relations: ['user'],
	})

	if (!borrowingRecord) throw new AppError({ message: ERROR_MESSAGES['BK-004'] })
	if (borrowingRecord.user.id !== userId) throw new AppError({ message: ERROR_MESSAGES['PER-001'], status: 403 })

	const previousRecord = await borrowingRecordService.getLatestRecord({
		userId,
		bookId,
		query: { returnedAt: Not(IsNull()) },
	})
	const previousUserScore = previousRecord?.userScore
	const paylaod = prepareNewScorePaylaod({ book, score, previousUserScore })

	Object.assign(borrowingRecord, { userScore: score, returnedAt: moment().toDate() })
	Object.assign(book, paylaod)

	await dbConnection.transaction(async (manager) => {
		await manager.save(borrowingRecord)
		await manager.save(book)
	})
}

const prepareNewScorePaylaod = (params: PrepareNewScorePaylaod) => {
	let { book, score, previousUserScore } = params
	let { borrowedCount, rawScore } = book

	const totalScores = rawScore * borrowedCount
	if (typeof previousUserScore !== 'number') {
		borrowedCount++
		previousUserScore = 0
	}
	rawScore = (totalScores + score - previousUserScore) / borrowedCount

	return { rawScore, borrowedCount }
}

const bookService = {
	getBooks,
	getBook,
	createBook,
	borrowBook,
	returnBook,
}
export default bookService
