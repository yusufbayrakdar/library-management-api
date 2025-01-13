import { FindManyOptions, FindOneOptions } from 'typeorm'

import Book from '../../entities/book.entity'
import dbConnection from '../../utils/dbConnection'

const repository = dbConnection.getRepository(Book)

const bookRepository = {
	find: (findManyOptions: FindManyOptions<Book> = {}) => {
		return repository.find(findManyOptions)
	},

	findOne: async (findOneOptions: FindOneOptions<Book>) => {
		return repository.findOne(findOneOptions)
	},

	create: async (name: string) => {
		const book = repository.create({ name })
		return repository.save(book)
	},
}
export default bookRepository
