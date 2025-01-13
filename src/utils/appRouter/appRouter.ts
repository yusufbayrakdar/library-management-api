import { Router } from 'express'

import { AsyncHandler } from './appRouter.types'

/**
 * Wraps an async handler function with error handling.
 * Sets the handler name in `res.locals.lastHandlerOnTheStack` for debugging purposes.
 *
 * @param {AsyncHandler} handler - The async handler to wrap.
 * @returns {AsyncHandler} The wrapped handler with error handling.
 */
function wrapHandler(handler: AsyncHandler): AsyncHandler {
	return async (req, res, next) => {
		res.locals.lastHandlerOnTheStack = handler.name
		try {
			await handler(req, res, next)
		} catch (error) {
			next(error) // Pass error to next middleware if any
		}
	}
}

/**
 * Creates a router with methods for adding wrapped route handlers.
 *
 * @returns {Object} An object containing methods for HTTP request handling and a method to retrieve the router.
 */
function AppRouter() {
	const router = Router()

	/**
	 * Registers a route with wrapped handlers for the specified HTTP method.
	 *
	 * @param {'get' | 'post' | 'put' | 'patch' | 'delete'} method - The HTTP method for the route.
	 * @param {string} path - The path for the route.
	 * @param {AsyncHandler[]} handlers - The async handlers for this route.
	 */
	const registerRoute = (
		method: 'get' | 'post' | 'put' | 'patch' | 'delete',
		path: string,
		handlers: AsyncHandler[],
	) => {
		const wrappedHandlers = handlers.map(wrapHandler)
		router[method](path, ...wrappedHandlers)
	}

	const routerMethods = {
		/**
		 * Adds a GET route to the router.
		 *
		 * @param {string} path - The path for the GET route.
		 * @param {...AsyncHandler[]} handlers - One or more async handlers for this route.
		 */
		get: (path: string, ...handlers: AsyncHandler[]) => registerRoute('get', path, handlers),

		/**
		 * Adds a POST route to the router.
		 *
		 * @param {string} path - The path for the POST route.
		 * @param {...AsyncHandler[]} handlers - One or more async handlers for this route.
		 */
		post: (path: string, ...handlers: AsyncHandler[]) => registerRoute('post', path, handlers),

		/**
		 * Adds a PUT route to the router.
		 *
		 * @param {string} path - The path for the PUT route.
		 * @param {...AsyncHandler[]} handlers - One or more async handlers for this route.
		 */
		put: (path: string, ...handlers: AsyncHandler[]) => registerRoute('put', path, handlers),

		/**
		 * Adds a PATCH route to the router.
		 *
		 * @param {string} path - The path for the PATCH route.
		 * @param {...AsyncHandler[]} handlers - One or more async handlers for this route.
		 */
		patch: (path: string, ...handlers: AsyncHandler[]) => registerRoute('patch', path, handlers),

		/**
		 * Adds a DELETE route to the router.
		 *
		 * @param {string} path - The path for the DELETE route.
		 * @param {...AsyncHandler[]} handlers - One or more async handlers for this route.
		 */
		delete: (path: string, ...handlers: AsyncHandler[]) => registerRoute('delete', path, handlers),

		/**
		 * Returns the configured router instance.
		 *
		 * @returns {Router} The configured Express router.
		 */
		getRouter: () => router,
	}

	return routerMethods
}

export default AppRouter
