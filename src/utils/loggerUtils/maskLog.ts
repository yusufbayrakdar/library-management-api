const blackList = ['password']

const maskNestedPath = (obj: Record<string, any>, path: string) => {
	const keys = path.split('.')
	let current = obj

	for (let i = 0; i < keys.length - 1; i++) {
		if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
			return
		}
		current = current[keys[i]]
	}

	const lastKey = keys[keys.length - 1]
	if (current[lastKey]) {
		current[lastKey] = '*******'
	}
}

const maskLog = (body: Record<string, any>, customBlackList?: string[]): Record<string, any> => {
	const maskPaths = customBlackList || blackList
	maskPaths.forEach((path) => maskNestedPath(body, path))
	return body
}

export default maskLog
