import { FindOptionsWhere } from 'typeorm'

import { BorrowingRecord } from '../../entities/borrowingRecord.entity'

export type GetLatestRecord = {
	userId: number
	bookId: number
	query?: FindOptionsWhere<BorrowingRecord>
}
