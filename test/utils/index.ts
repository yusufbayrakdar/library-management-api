import * as chaiModule from 'chai'
import chaiHttp from 'chai-http'

import { initServer } from '../../src/initServer'
import dbConnection from '../../src/utils/dbConnection'
import ENV from '../../src/utils/env/env'
import { ENV_TYPES } from '../../src/utils/env/env.types'

if (ENV.SERVICE_ENV !== ENV_TYPES.TEST) {
	throw new Error(`[ENV] Expected environment to be '${ENV_TYPES.TEST}' but got '${ENV.SERVICE_ENV}'`)
}

// Initialize DB before tests
before(() => dbConnection.initialize())

async function clearDatabase() {
	try {
		const entities = dbConnection.entityMetadatas
		const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ')

		await dbConnection.query(`TRUNCATE ${tableNames} CASCADE;`)
		console.log('[TEST DATABASE] Clean')
	} catch (error) {
		throw new Error(`[TEST DATABASE] Clearing error: ${error}`)
	}
}

const chai = chaiModule.use(chaiHttp)

initServer()
const agent = chai.request.agent('http://localhost:3000')

const testUtils = { agent, clearDatabase }
export default testUtils
