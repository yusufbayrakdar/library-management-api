import Joi from 'joi'

const UserCreateSchema = Joi.object({
	name: Joi.string().required(),
})

const UserListTestSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
})

const UserDetailTestSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
	books: Joi.object({
		past: Joi.array().items(
			Joi.object({
				name: Joi.string(),
				userScore: Joi.number(),
			}),
		),
		present: Joi.array().items(
			Joi.object({
				name: Joi.string(),
				userScore: Joi.number(),
			}),
		),
	}),
})

const userSchemas = { UserCreateSchema, UserListTestSchema, UserDetailTestSchema }
export default userSchemas
