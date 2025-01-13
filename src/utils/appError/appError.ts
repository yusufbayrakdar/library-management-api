import { AppErrorParams } from './appError.types'
import ERROR_MESSAGES from '../constants/errorMessages/errorMessages'
import { ErrorCode, ErrorMessage } from '../constants/errorMessages/errorMessages.types'

const ERROR_MESSAGES_REVERSE_MAP = Object.fromEntries(
	Object.entries(ERROR_MESSAGES).map(([code, message]) => [message, code]),
) as Record<ErrorMessage, ErrorCode>

export class AppError extends Error {
	errorCode: ErrorCode

	status: number

	details?: string

	constructor(appErrorParams: AppErrorParams) {
		super(appErrorParams.message)
		this.errorCode = ERROR_MESSAGES_REVERSE_MAP[appErrorParams.message]
		this.status = appErrorParams.status ?? 400
		this.details = appErrorParams.details

		// Set the prototype explicitly to maintain the instanceof behavior
		Object.setPrototypeOf(this, AppError.prototype)
	}
}
