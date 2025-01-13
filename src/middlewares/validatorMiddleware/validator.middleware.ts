import { NextFunction, Request, Response } from 'express'

import { VALIDATION_SOURCE, VALIDATION_SOURCE_ERROR, ValidatorParams } from './validator.middleware.types'
import { AppError } from '../../utils/appError/appError'
import loggerUtils from '../../utils/loggerUtils/logger.utils'
import validatorUtils from '../../utils/validator.utils'

const validator = (params: ValidatorParams) => {
	const { schema, source = VALIDATION_SOURCE.BODY } = params

	return async function validatorRequestHandler(req: Request, res: Response, next: NextFunction) {
		try {
			const data = req[source]
			const { value, error } = schema.validate(data, { abortEarly: false })

			if (error) {
				const details = validatorUtils.formatJoiErrorsIntoMessage(error.details)
				throw new AppError({ message: VALIDATION_SOURCE_ERROR[source], status: 400, details })
			}

			req[source] = value
			next()
		} catch (error: any) {
			return loggerUtils.errorLogger(error)
		}
	}
}

export default validator
