import { FindManyOptions, FindOneOptions } from 'typeorm'

import { CreateBorrowingRecordParams } from './borrowingRecord.repository.types'
import { BorrowingRecord } from '../../entities/borrowingRecord.entity'
import dbConnection from '../../utils/dbConnection'

const repository = dbConnection.getRepository(BorrowingRecord)

const borrowingRecordRepository = {
	find: (findManyOptions: FindManyOptions<BorrowingRecord> = {}) => {
		return repository.find(findManyOptions)
	},

	findOne: async (findOneOptions: FindOneOptions<BorrowingRecord>) => {
		return repository.findOne(findOneOptions)
	},

	create: async (params: CreateBorrowingRecordParams): Promise<BorrowingRecord> => {
		const book = repository.create(params)
		return repository.save(book)
	},
}
export default borrowingRecordRepository
