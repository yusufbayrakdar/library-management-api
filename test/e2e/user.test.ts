import { expect } from 'chai'
import { randomUUID } from 'crypto'

import User from '../../src/entities/user.entity'
import userRepository from '../../src/repositories/userRepository/user.repository'
import bookService from '../../src/services/bookService/book.service'
import ERROR_MESSAGES from '../../src/utils/constants/errorMessages/errorMessages'
import userSchemas from '../../src/utils/validationSchemas/user/user.validationSchemas'
import testUtils from '../utils'
import bookTestUtils from '../utils/bookTestUtils/book.testUtils'
import userTestUtils from '../utils/userTestUtils/user.testUtils'

const { agent, clearDatabase } = testUtils

describe('User Tests', () => {
	before(clearDatabase)

	describe('Sunny Day Scenarios', () => {
		it('[GET /users] should get the user list', async function () {
			const userNames: string[] = []
			for (let i = 0; i < 2; i++) {
				const user = await userTestUtils.createUser()
				userNames.push(user.name)
			}

			const res = await agent.get('/users')
			expect(res).to.have.status(200)
			const users = res.body as User[]
			expect(Array.isArray(users)).to.equals(true)
			expect(userNames.length).to.equals(users.length)
			const userNameSet = new Set(userNames)
			users.forEach((user) => {
				userTestUtils.testUserFormat({ user, schema: userSchemas.UserListTestSchema })
				expect(userNameSet.has(user.name)).to.equals(true)
			})
		})

		it('[GET /users/:id] should get the detail of a user', async function () {
			const createdUser = await userTestUtils.createUser()
			const createdBookToReturn = await bookTestUtils.createBook()
			await bookService.borrowBook({ bookId: createdBookToReturn.id, userId: createdUser.id })
			await bookService.returnBook({ bookId: createdBookToReturn.id, userId: createdUser.id, score: 7 })

			const createdBookToBorrow = await bookTestUtils.createBook()
			await bookService.borrowBook({ bookId: createdBookToBorrow.id, userId: createdUser.id })

			const res = await agent.get(`/users/${createdUser.id}`)
			expect(res).to.have.status(200)
			const user = res.body as User
			userTestUtils.testUserFormat({ user, schema: userSchemas.UserDetailTestSchema })
		})

		it('[POST /users] should create a user successfully', async function () {
			const userName = randomUUID()

			const res = await agent.post('/users').send({ name: userName })
			expect(res).to.have.status(201)

			const createdUser = await userRepository.findOne({ where: { name: userName } })
			expect(createdUser?.id).to.be.a('number')
			expect(createdUser?.name).to.be.a('string')
		})
	})

	describe('Rainy Day Scenarios', () => {
		it('[GET /users:id] should fail if the user not found', async function () {
			const res = await agent.get('/users/2025')

			expect(res).to.have.status(404)
			expect(res.body.message).to.equals(ERROR_MESSAGES['USR-001'])
			expect(res.body.errorCode).to.equals('USR-001')
			expect(typeof res.body.module).to.equals('string')
		})

		it('[POST /users:id] should fail if the user already exists', async function () {
			const createdUser = await userTestUtils.createUser()
			const res = await agent.post('/users').send({ name: createdUser.name })

			expect(res).to.have.status(400)
			expect(res.body.message).to.equals(ERROR_MESSAGES['USR-002'])
			expect(res.body.errorCode).to.equals('USR-002')
			expect(typeof res.body.module).to.equals('string')
		})
	})
})
