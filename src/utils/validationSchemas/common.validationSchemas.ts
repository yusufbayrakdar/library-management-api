import Joi from 'joi'

const Id = Joi.object({
	id: Joi.number().required(),
})

const commonSchemas = { Id }
export default commonSchemas
