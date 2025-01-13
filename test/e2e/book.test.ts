import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { IsNull, Not } from 'typeorm'

import Book from '../../src/entities/book.entity'
import User from '../../src/entities/user.entity'
import bookRepository from '../../src/repositories/bookRepository/book.repository'
import borrowingRecordRepository from '../../src/repositories/borrowingRecord.ts/borrowingRecord.repository'
import bookService from '../../src/services/bookService/book.service'
import borrowingRecordService from '../../src/services/borrowingRecordService/borrowingRecord.service'
import userService from '../../src/services/userService/user.service'
import ERROR_MESSAGES from '../../src/utils/constants/errorMessages/errorMessages'
import bookSchemas from '../../src/utils/validationSchemas/book/book.validationSchemas'
import testUtils from '../utils'
import bookTestUtils from '../utils/bookTestUtils/book.testUtils'
import userTestUtils from '../utils/userTestUtils/user.testUtils'

const { agent, clearDatabase } = testUtils

describe('Book Tests', () => {
	before(clearDatabase)

	describe('Sunny Day Scenarios', () => {
		it('[GET /books] should get the book list', async function () {
			const bookNames: string[] = []
			for (let i = 0; i < 2; i++) {
				const book = await bookTestUtils.createBook()
				bookNames.push(book.name)
			}

			const res = await agent.get('/books')
			expect(res).to.have.status(200)
			const books = res.body as Book[]
			expect(Array.isArray(books)).to.equals(true)
			expect(bookNames.length).to.equals(books.length)
			const bookNameSet = new Set(bookNames)
			books.forEach((book) => {
				bookTestUtils.testBookFormat({ book, schema: bookSchemas.BookListTestSchema })
				expect(bookNameSet.has(book.name)).to.equals(true)
			})
		})

		it('[GET /book] should get the detail of a book', async function () {
			const createdBook = await bookTestUtils.createBook()

			const res = await agent.get(`/books/${createdBook.id}`)
			expect(res).to.have.status(200)
			const book = res.body as Book
			bookTestUtils.testBookFormat({ book, schema: bookSchemas.BookDetailTestSchema })
		})

		it('[GET /book] should get the detail of a book after a return', async function () {
			const createdBook = await bookTestUtils.createBook()
			for (let i = 0; i < 10; i++) {
				const createdUser = await userTestUtils.createUser()
				await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })
				await bookService.returnBook({ bookId: createdBook.id, userId: createdUser.id, score: i })
			}

			const res = await agent.get(`/books/${createdBook.id}`)
			expect(res).to.have.status(200)
			const book = res.body as Book
			bookTestUtils.testBookFormat({ book, schema: bookSchemas.BookDetailTestSchema })
			expect(book.score).to.equals(4.5)
		})

		it('[GET /book] should get the detail of a book with correct values after re-evaluating a book of a user', async function () {
			const createdBook = await bookTestUtils.createBook()
			let createdUser: User
			for (let i = 0; i < 10; i++) {
				createdUser = await userTestUtils.createUser()
				await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })
				await bookService.returnBook({ bookId: createdBook.id, userId: createdUser.id, score: i })
			}

			await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser!.id })
			await bookService.returnBook({ bookId: createdBook.id, userId: createdUser!.id, score: 3 })

			const res = await agent.get(`/books/${createdBook.id}`)
			expect(res).to.have.status(200)
			const book = res.body as Book
			bookTestUtils.testBookFormat({ book, schema: bookSchemas.BookDetailTestSchema })
			expect(book.score).to.equals(3.9)
		})

		it('[POST /book] should create a book successfully', async function () {
			const bookName = randomUUID()

			const res = await agent.post('/books').send({ name: bookName })
			expect(res).to.have.status(201)

			const createdBook = await bookRepository.findOne({ where: { name: bookName } })
			expect(createdBook?.id).to.be.a('number')
			expect(createdBook?.name).to.be.a('string')
		})

		it('[POST /users/:id/borrow/:bookId] should borrow a book successfully', async function () {
			const book = await bookTestUtils.createBook()
			const user = await userTestUtils.createUser()

			const res = await agent.post(`/users/${user.id}/borrow/${book.id}`)
			expect(res).to.have.status(204)

			const record = await borrowingRecordService.getLatestRecord({ userId: user.id, bookId: book.id })
			expect(record?.id).to.be.a('number')
			expect(record?.userScore).to.equals(null)
			expect(record?.returnedAt).to.equals(null)
		})

		it('[POST /users/:id/borrow/:bookId] should borrow the book borrowed before without spoiling the userScore', async function () {
			const book = await bookTestUtils.createBook()
			const user = await userTestUtils.createUser()

			for (let i = 0; i < 3; i++) {
				await bookService.borrowBook({ bookId: book.id, userId: user.id })
				await bookService.returnBook({ bookId: book.id, userId: user.id, score: i })
			}

			const res = await agent.post(`/users/${user.id}/borrow/${book.id}`)
			expect(res).to.have.status(204)

			const records = await borrowingRecordRepository.find({
				where: { user: { id: user.id }, book: { id: book.id }, returnedAt: Not(IsNull()) },
			})
			records.forEach((record, index) => {
				expect(record?.id).to.be.a('number')
				expect(record?.userScore).to.equals(index)
				expect(record?.returnedAt).to.be.instanceOf(Date)
			})

			const unreturnedRecord = await borrowingRecordService.getLatestRecord({
				userId: user.id,
				bookId: book.id,
				query: { returnedAt: IsNull() },
			})
			expect(unreturnedRecord?.id).to.be.a('number')
			expect(unreturnedRecord?.userScore).to.equals(null)
			expect(unreturnedRecord?.returnedAt).to.equals(null)

			const updatedBook = await bookService.getBook(book.id)
			expect(updatedBook.score).to.equals(2)

			const updatedUser = await userService.getUser(user.id)
			const past = updatedUser.books.past
			const [present] = updatedUser.books.present

			past.forEach((record, index) => {
				expect(record.name).to.equals(book.name)
				expect(record.userScore).to.equals(index)
			})

			expect(present.name).to.equals(book.name)
			expect(present).to.not.have.property('userScore')
		})

		it('[POST /users/:id/return/:bookId] should return a book successfully', async function () {
			const book = await bookTestUtils.createBook()
			const user = await userTestUtils.createUser()

			await bookService.borrowBook({ bookId: book.id, userId: user.id })

			const res = await agent.post(`/users/${user.id}/return/${book.id}`).send({ score: 9 })
			expect(res).to.have.status(204)

			const record = await borrowingRecordService.getLatestRecord({ userId: user.id, bookId: book.id })
			expect(record?.id).to.be.a('number')
			expect(record?.userScore).to.equals(9)
			expect(record?.returnedAt).to.be.instanceOf(Date)
		})

		it('[POST /users/:id/return/:bookId] should return the book returned before and borrowed again successfully', async function () {
			const createdBook = await bookTestUtils.createBook()
			const createdUser = await userTestUtils.createUser()

			await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })
			await bookService.returnBook({ bookId: createdBook.id, userId: createdUser.id, score: 3 })
			await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })

			const res = await agent.post(`/users/${createdUser.id}/return/${createdBook.id}`).send({ score: 9 })
			expect(res).to.have.status(204)

			const record = await borrowingRecordService.getLatestRecord({ userId: createdUser.id, bookId: createdBook.id })
			expect(record?.id).to.be.a('number')
			expect(record?.userScore).to.equals(9)
			expect(record?.returnedAt).to.be.instanceOf(Date)

			const book = await bookRepository.findOne({ where: { id: createdBook.id } })
			expect(book?.borrowedCount).to.equals(1)
		})
	})

	describe('Rainy Day Scenarios', () => {
		it('[GET /books:id] should fail if the book not found', async function () {
			const res = await agent.get('/books/2025')

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-001'])
			expect(res.body.errorCode).to.equals('BK-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /books:id] should fail if the book already exists', async function () {
			const createdBook = await bookTestUtils.createBook()
			const res = await agent.post('/books').send({ name: createdBook.name })

			expect(res).to.have.status(400)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-002'])
			expect(res.body.errorCode).to.equals('BK-002')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/borrow/:bookId] should fail if the user not found', async function () {
			const res = await agent.post('/users/2025/borrow/2025')

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['USR-001'])
			expect(res.body.errorCode).to.equals('USR-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/borrow/:bookId] should fail if the book not found', async function () {
			const createdUser = await userTestUtils.createUser()
			const res = await agent.post(`/users/${createdUser.id}/borrow/2025`)

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-001'])
			expect(res.body.errorCode).to.equals('BK-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/borrow/:bookId] should fail if the book unavailable', async function () {
			const createdUser = await userTestUtils.createUser()
			const createdBook = await bookTestUtils.createBook()

			await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })

			const res = await agent.post(`/users/${createdUser.id}/borrow/${createdBook.id}`)

			expect(res).to.have.status(409)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-003'])
			expect(res.body.errorCode).to.equals('BK-003')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/return/:bookId] should fail if the user not found', async function () {
			const res = await agent.post('/users/2025/return/2025')

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['USR-001'])
			expect(res.body.errorCode).to.equals('USR-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/return/:bookId] should fail if the book not found', async function () {
			const createdUser = await userTestUtils.createUser()
			const res = await agent.post(`/users/${createdUser.id}/return/2025`)

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-001'])
			expect(res.body.errorCode).to.equals('BK-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/return/:bookId] should fail if the book available already', async function () {
			const createdUser = await userTestUtils.createUser()
			const createdBook = await bookTestUtils.createBook()
			const res = await agent.post(`/users/${createdUser.id}/return/${createdBook.id}`)

			expect(res).to.have.status(400)
			expect(res.body.message).to.equals(ERROR_MESSAGES['BK-004'])
			expect(res.body.errorCode).to.equals('BK-004')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users/:id/return/:bookId] should fail on unauthorized requests', async function () {
			const createdUser = await userTestUtils.createUser()
			const unauthorizedUser = await userTestUtils.createUser()
			const createdBook = await bookTestUtils.createBook()

			await bookService.borrowBook({ bookId: createdBook.id, userId: createdUser.id })

			const res = await agent.post(`/users/${unauthorizedUser.id}/return/${createdBook.id}`)

			expect(res).to.have.status(403)
			expect(res.body.message).to.equals(ERROR_MESSAGES['PER-001'])
			expect(res.body.errorCode).to.equals('PER-001')
			expect(typeof res.body.module).to.equals('string')
		})
	})
})
