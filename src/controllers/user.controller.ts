import { Request, Response } from 'express'

import userService from '../services/userService/user.service'
import loggerUtils from '../utils/loggerUtils/logger.utils'

const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await userService.getUsers()

		res.status(200).json(users)
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const getUser = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id)
		const user = await userService.getUser(id)

		res.status(200).json(user)
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const createUser = async (req: Request, res: Response) => {
	try {
		await userService.createUser(req.body.name)

		res.status(201).end()
	} catch (error: any) {
		return loggerUtils.errorLogger(error)
	}
}

const userController = {
	getUsers,
	getUser,
	createUser,
}
export default userController
