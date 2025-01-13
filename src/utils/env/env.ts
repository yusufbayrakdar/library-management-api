import dotenv from 'dotenv'

import { SanitizedNodeEnv } from './env.types'
import EnvSchema from '../validationSchemas/env/env.validationSchemas'

dotenv.config()

const { value: ENV, error } = EnvSchema.validate(process.env, {
	allowUnknown: false,
	stripUnknown: true,
	abortEarly: false,
})

if (error) throw new Error('[ENV] ' + error.message)

export default ENV as SanitizedNodeEnv
