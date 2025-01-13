import Joi from 'joi'

import { ENV_TYPES } from '../../env/env.types'

const EnvSchema = Joi.object({
	SERVICE_ENV: Joi.string()
		.valid(...Object.values(ENV_TYPES))
		.required(),
	SERVICE_PORT: Joi.number().required(),
	API_DB_URL: Joi.string().required(),
	ALLOWED_ORIGIN: Joi.string().default('*'),
})

export default EnvSchema
