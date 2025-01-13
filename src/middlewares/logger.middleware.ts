import { Request, Response, NextFunction } from 'express'

import LOG_LEVELS from '../utils/constants/logLevels'
import loggerUtils from '../utils/loggerUtils/logger.utils'

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	res.on('finish', () => {
		if (res.statusCode >= 400) return

		loggerUtils.infoLogger({ level: LOG_LEVELS.INFO })
	})

	next()
}
