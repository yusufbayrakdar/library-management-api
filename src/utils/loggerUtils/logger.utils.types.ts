import LOG_LEVELS from '../constants/logLevels'

type LogLevels = keyof typeof LOG_LEVELS

export type InfoLoggerFunction = (params: {
	level: LogLevels
	error?: {
		message?: string
		errorCode?: string
		details?: string | object
		status: number
		module?: string
		caller?: string
		line?: string
	}
}) => void
