import { expect } from 'chai'
import { randomUUID } from 'crypto'

import { TestBookFormatParams } from './book.testUtils.types'
import bookService from '../../../src/services/bookService/book.service'

const createBook = async () => {
	const bookName = randomUUID()
	return bookService.createBook(bookName)
}

const testBookFormat = (params: TestBookFormatParams) => {
	const { book, schema } = params
	const { error } = schema.validate(book)
	expect(error?.message).to.equals(undefined)
}

const bookTestUtils = { createBook, testBookFormat }
export default bookTestUtils
