import chalk from 'chalk'
import moment from 'moment'

import { InfoLoggerFunction } from './logger.utils.types'
import maskLog from './maskLog'
import { getRequestContext } from '../../middlewares/requestContext.middleware'
import { AppError } from '../appError/appError'
import ERROR_MESSAGES from '../constants/errorMessages/errorMessages'
import LOG_LEVELS from '../constants/logLevels'
import ENV from '../env/env'
import { ENV_TYPES } from '../env/env.types'

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const findModuleAndLine = (stack: string): { module?: string; line?: string } => {
	if (!stack) return {}

	let extensionIndex = stack.indexOf('.ts')
	if (extensionIndex === -1) extensionIndex = stack.indexOf('.js')
	if (extensionIndex === -1) return {}

	// Find the start of the file name (just after the last '/')
	const lastSlashIndex = stack.lastIndexOf('/', extensionIndex)
	if (lastSlashIndex === -1) return {}

	// Extract the file name
	const fileName = stack.substring(lastSlashIndex + 1, extensionIndex)

	// Find the position of the ':', which is the start of the line number
	const lineStartIndex = stack.indexOf(':', extensionIndex)
	const lineEndIndex = stack.indexOf(')', extensionIndex)
	const line =
		lineStartIndex !== -1 && lineEndIndex !== -1 ? `${stack.substring(lineStartIndex + 1, lineEndIndex)}` : ''

	// Capitalize each part of the file name and join them
	return { module: fileName.split('.').map(capitalize).join(''), line }
}

function findCallerName(stack: string): string | undefined {
	if (!stack) return
	const functionNamePreposition = 'at '

	for (const line of stack.split('\n')) {
		const trimmed = line.trim()
		if (trimmed.startsWith(functionNamePreposition)) {
			const parts = trimmed.split(' ')
			const functionName = parts[1]?.replace('Object.', '')

			if (functionName && functionName !== '<anonymous>') {
				return functionName
			}
		}
	}
}

const errorLogger = (error: AppError) => {
	const { res } = getRequestContext()
	if (!res) throw new Error('Request context is not set!')

	let { message, errorCode, details, status = 500, stack = '' } = error
	let somethingWentWrongPayload = {}

	if (!errorCode || errorCode === 'GEN-001') {
		somethingWentWrongPayload = { message: ERROR_MESSAGES['GEN-001'], errorCode: 'GEN-001', module: undefined }
	}

	const stackForTrace = ENV.SERVICE_ENV === ENV_TYPES.TEST ? { stack } : {}

	const { module, line } = findModuleAndLine(stack)
	const responsePayload = {
		message,
		errorCode,
		details,
		module,
		...stackForTrace,
	}
	const caller = findCallerName(stack)
	infoLogger({
		level: LOG_LEVELS.ERROR,
		error: { status, caller, line, ...responsePayload },
	})
	return res.status(status).json({ ...responsePayload, ...somethingWentWrongPayload })
}

const infoLogger: InfoLoggerFunction = ({ level, error }) => {
	const { req, res } = getRequestContext()
	if (!req || !res) throw new Error('Request context is not set!')
	if (ENV.SERVICE_ENV === ENV_TYPES.TEST) return

	const status = error?.status ?? res.statusCode
	const reqLogData = {
		timestamp: new Date().toISOString(),
		level,
		status,
		message: error?.message,
		errorCode: error?.errorCode,
		details: error?.details,
		url: (req.baseUrl || '') + req.path,
		method: req.method,
		body: maskLog(req.body),
		query: req.query,
		params: req.params,
		ip: req.ip,
		handler: status >= 400 && res.locals.lastHandlerOnTheStack,
		caller: error?.caller,
		location: error?.module && error?.line ? `${error.module}:${error.line}` : error?.module,
		requestId: req.headers['request-id'],
	}

	log(reqLogData)
}

const logWithStringify = (reqLogData: any) => {
	const logMessage = JSON.stringify(reqLogData)
	console.info(logMessage)
}

function colorizeStatusCode(status: number): string {
	if (status >= 200 && status < 300) return chalk.green(status.toString()) // Success
	if (status >= 300 && status < 400) return chalk.cyan(status.toString()) // Redirection
	if (status >= 400 && status < 500) return chalk.yellow(status.toString()) // User Error
	if (status >= 500) return chalk.redBright(status.toString()) // Server Error
	return status.toString() // Default
}

const logWithColors = (reqLogData: any) => {
	const time = moment(reqLogData?.timestamp).format('DD/MM/yyyy-HH:mm').toString()
	const levelChalk = reqLogData?.level === LOG_LEVELS.ERROR ? chalk.redBright : chalk.blueBright

	const { level, method, url, query, body, status, errorCode, message, details, handler, caller, location } = reqLogData

	const log = [
		chalk.gray(time),
		levelChalk(level),
		`${chalk.magentaBright(method)} ${chalk.cyanBright(url)}`,
		colorizeStatusCode(status),
	]
	const errorWithCode = [errorCode, message].filter((e) => e).join(' ')
	if (errorWithCode) log.push(chalk.redBright(errorWithCode))
	if (details) log.push(details)
	if (handler) log.push(`Handler ${handler}`)
	if (caller) log.push(`Caller ${caller}`)
	if (location) log.push(`Location ${location}`)

	const bodyLog = Object.keys(body).length ? ['\nBody', body] : []
	const queryLog = Object.keys(query).length ? ['\nQuery', query] : []

	console.log(log.join(' ~ '), ...queryLog, ...bodyLog)
}

const log = ENV.SERVICE_ENV === ENV_TYPES.LOCAL ? logWithColors : logWithStringify

const loggerUtils = { errorLogger, infoLogger, findModuleAndLine }
export default loggerUtils
