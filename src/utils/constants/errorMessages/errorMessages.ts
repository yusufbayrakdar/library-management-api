const ERROR_MESSAGES = {
	'GEN-001': 'Something went wrong',
	'PER-001': 'Permission denied',
	'VAL-001': 'Body validation failed',
	'VAL-002': 'Params validation failed',
	'VAL-003': 'Query validation failed',
	'VAL-004': 'Header validation failed',
	'USR-001': 'User not found',
	'USR-002': 'User already exists',
	'BK-001': 'Book not found',
	'BK-002': 'Book already exists',
	'BK-003': 'Book unavailable',
	'BK-004': 'Book available already',
} as const

export default ERROR_MESSAGES
