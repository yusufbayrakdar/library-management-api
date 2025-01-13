export enum ENV_TYPES {
	LOCAL = 'local',
	DEV = 'dev',
	TEST = 'test',
	RELEASE = 'release',
	PROD = 'prod',
}

export type NodeEnv = Readonly<{
	SERVICE_ENV: ENV_TYPES
	SERVICE_PORT: number
	API_DB_URL: string
	ALLOWED_ORIGIN: string
}>

export type SanitizedNodeEnv = Required<NodeEnv>
