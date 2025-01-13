import 'reflect-metadata'
import { DataSource } from 'typeorm'

import ENV from './env/env'

const dbConnection = new DataSource({
	type: 'postgres',
	url: ENV.API_DB_URL,
	synchronize: false,
	logging: false,
	entities: [__dirname + '/../entities/*.{js,ts}'],
	migrations: [__dirname + '/../migrations/*.{js,ts}'],
})

export default dbConnection
