import { GetLatestRecord } from './borrowingRecord.service.types'
import borrowingRecordRepository from '../../repositories/borrowingRecord.ts/borrowingRecord.repository'

const getLatestRecord = async (params: GetLatestRecord) => {
	const { userId, bookId, query } = params

	return borrowingRecordRepository.findOne({
		where: { user: { id: userId }, book: { id: bookId }, ...query },
		order: {
			createdAt: 'DESC',
		},
	})
}

const borrowingRecordService = {
	getLatestRecord,
}
export default borrowingRecordService
