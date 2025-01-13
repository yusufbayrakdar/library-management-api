import { FindManyOptions, FindOneOptions } from 'typeorm'

import { CreateUserParams } from './user.repository.types'
import User from '../../entities/user.entity'
import dbConnection from '../../utils/dbConnection'

const repository = dbConnection.getRepository(User)

const userRepository = {
	find: (findManyOptions: FindManyOptions<User> = {}) => {
		return repository.find(findManyOptions)
	},

	findOne: async (findOneOptions: FindOneOptions<User>) => {
		return repository.findOne(findOneOptions)
	},

	create: async (params: CreateUserParams) => {
		const user = repository.create(params)
		return repository.save(user)
	},
}
export default userRepository
