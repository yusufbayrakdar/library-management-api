import Joi from 'joi'

import User from '../../../src/entities/user.entity'

export type TestUserFormatParams = {
	user: User
	schema: Joi.Schema
}
