import { initServer } from './initServer'
import dbConnection from './utils/dbConnection'
import ENV from './utils/env/env'

const main = async () => {
	await dbConnection.initialize()

	initServer()
	return { ENV: ENV.SERVICE_ENV, dbReady: dbConnection.isInitialized, expressReady: true }
}

main().then(console.log)
export default main
