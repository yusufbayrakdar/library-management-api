import ERROR_MESSAGES from './errorMessages'

type ErrorMessageMap = typeof ERROR_MESSAGES
type ErrorCode = keyof ErrorMessageMap
type ErrorMessage = ErrorMessageMap[ErrorCode]

export { ErrorCode, ErrorMessage }
