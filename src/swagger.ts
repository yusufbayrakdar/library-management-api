import swaggerJsdoc from 'swagger-jsdoc'

import ENV from './utils/env/env'

const swaggerSpec = swaggerJsdoc({
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Express',
			version: '1.0.0',
			description: 'Express API documentation',
		},
		servers: [
			{
				url: `http://localhost:${ENV.SERVICE_PORT}`,
				description: 'local',
			},
		],
	},
	apis: ['*/routes/**/*.swagger.yaml'],
})

export default swaggerSpec
