import { ObjectSchema } from 'joi'

import ERROR_MESSAGES from '../../utils/constants/errorMessages/errorMessages'

export enum VALIDATION_SOURCE {
	BODY = 'body',
	QUERY = 'query',
	PARAMS = 'params',
}

export type ValidatorParams = {
	schema: ObjectSchema
	source?: VALIDATION_SOURCE
}

export const VALIDATION_SOURCE_ERROR = {
	[VALIDATION_SOURCE.BODY]: ERROR_MESSAGES['VAL-001'],
	[VALIDATION_SOURCE.PARAMS]: ERROR_MESSAGES['VAL-002'],
	[VALIDATION_SOURCE.QUERY]: ERROR_MESSAGES['VAL-003'],
}
