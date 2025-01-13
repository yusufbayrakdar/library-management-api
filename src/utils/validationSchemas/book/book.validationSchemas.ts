import Joi from 'joi'

const BookCreateSchema = Joi.object({
	name: Joi.string().required(),
})

const BookReturnSchema = Joi.object({
	score: Joi.number().min(0).max(10),
})

const BorrowingParams = Joi.object({
	id: Joi.number().required(),
	bookId: Joi.number().required(),
})

const BookListTestSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
})

const BookDetailTestSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
	score: Joi.number().required(),
})

const bookSchemas = { BookCreateSchema, BookReturnSchema, BorrowingParams, BookListTestSchema, BookDetailTestSchema }
export default bookSchemas
