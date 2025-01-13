import Joi from 'joi'

import Book from '../../../src/entities/book.entity'

export type TestBookFormatParams = {
	book: Book
	schema: Joi.Schema
}
