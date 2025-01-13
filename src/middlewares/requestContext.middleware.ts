import { Request, Response, NextFunction } from 'express'
import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage<{ req: Request; res: Response }>()

export default function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
	asyncLocalStorage.run({ req, res }, () => next())
}

export function getRequestContext() {
	const store = asyncLocalStorage.getStore()
	return { req: store?.req, res: store?.res }
}
