import { Request, Response } from 'express'

import bookService from '../services/bookService/book.service'
import loggerUtils from '../utils/loggerUtils/logger.utils'

const getBooks = async (req: Request, res: Response) => {
	try {
		const books = await bookService.getBooks()

		res.status(200).json(books)
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const getBook = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id)
		const book = await bookService.getBook(id)

		res.status(200).json(book)
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const createBook = async (req: Request, res: Response) => {
	try {
		await bookService.createBook(req.body.name)

		res.status(201).end()
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const borrowBook = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id)
		const bookId = Number(req.params.bookId)

		await bookService.borrowBook({ userId, bookId })

		res.status(204).end()
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const returnBook = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id)
		const bookId = Number(req.params.bookId)
		const score = Number(req.body.score)

		await bookService.returnBook({ userId, bookId, score })

		res.status(204).end()
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const bookController = {
	getBooks,
	getBook,
	createBook,
	borrowBook,
	returnBook,
}
export default bookController
