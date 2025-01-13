import bodyParser from 'body-parser'
import Cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import http from 'http'
import swaggerUi from 'swagger-ui-express'

import loggerMiddleware from './middlewares/logger.middleware'
import requestContextMiddleware from './middlewares/requestContext.middleware'
import routes from './routes'
import swaggerSpec from './swagger'
import ERROR_MESSAGES from './utils/constants/errorMessages/errorMessages'
import LOG_LEVELS from './utils/constants/logLevels'
import ENV from './utils/env/env'
import loggerUtils from './utils/loggerUtils/logger.utils'

const initServer = () => {
	const app = express()
	const cors = { origin: ENV.ALLOWED_ORIGIN, credentials: true }
	const limit = '50mb'
	app.set('trust proxy', 1)
	app.use(Cors(cors))
	app.use(bodyParser.json({ limit }))
	app.use(
		bodyParser.urlencoded({
			limit,
			extended: true,
			parameterLimit: 50000,
		}),
	)
	app.use(requestContextMiddleware)
	app.use(loggerMiddleware)

	app.get('/', (req, res) => {
		res.json({ message: 'Welcome to the Library Management System API' })
	})

	app.get('/api-docs/swagger.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	app.use('/', routes)
	app.use('*', (req, res) => {
		loggerUtils.infoLogger({
			level: LOG_LEVELS.ERROR,
			error: { message: 'URL not found', status: 404, module: 'InitServer' },
		})
		return res.status(500).json({ message: ERROR_MESSAGES['GEN-001'], errorCode: 'GEN-001' })
	})

	const limiter = rateLimit({
		windowMs: 60 * 1000,
		max: 10000,
		message: 'Too many requests from this IP, please try again later.',
	})
	app.use(limiter)

	const server = http.createServer(app)
	server.listen(ENV.SERVICE_PORT, () => console.log(`Express server is listening on port ${ENV.SERVICE_PORT}`))
}

export { initServer }
