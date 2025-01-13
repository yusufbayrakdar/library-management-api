import { Books } from './user.service.types'
import { BorrowingRecord } from '../../entities/borrowingRecord.entity'
import { UserSelectOptions } from '../../entities/user.entity'
import userRepository from '../../repositories/userRepository/user.repository'
import { AppError } from '../../utils/appError/appError'
import ERROR_MESSAGES from '../../utils/constants/errorMessages/errorMessages'

const getUsers = async () => {
	return userRepository.find({ select: UserSelectOptions.list })
}

const classifyBooks = (books: Books, record: BorrowingRecord) => {
	const { book, userScore } = record
	if (record.returnedAt) books.past.push({ name: book.name, userScore })
	else books.present.push({ name: book.name })
	return books
}

const getUser = async (id: number) => {
	const user = await userRepository.findOne({
		where: { id },
		relations: ['borrowingRecords.book'],
		select: UserSelectOptions.detail,
	})
	if (!user) throw new AppError({ message: ERROR_MESSAGES['USR-001'], status: 404 })

	const books = user.borrowingRecords.reduce(classifyBooks, { past: [], present: [] })

	return { id: user.id, name: user.name, books }
}

const createUser = async (name: string) => {
	const userExists = await userRepository.findOne({ where: { name } })
	if (userExists) throw new AppError({ message: ERROR_MESSAGES['USR-002'] })

	return userRepository.create({ name })
}

const userService = {
	getUsers,
	getUser,
	createUser,
}
export default userService
