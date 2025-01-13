import { expect } from 'chai'
import { randomUUID } from 'crypto'

import { TestUserFormatParams } from './user.testUtils.types'
import userService from '../../../src/services/userService/user.service'

const createUser = async () => {
	const userName = randomUUID()
	return userService.createUser(userName)
}

const testUserFormat = (params: TestUserFormatParams) => {
	const { user, schema } = params
	const { error } = schema.validate(user)
	expect(error?.message).to.equals(undefined)
}

const userTestUtils = { createUser, testUserFormat }
export default userTestUtils
