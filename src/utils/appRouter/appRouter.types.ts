import { NextFunction, Request, Response } from 'express'

/**
 * Type definition for an asynchronous Express handler.
 *
 * @callback AsyncHandler
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void> | void} A promise resolving to a response or void.
 */
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | void
