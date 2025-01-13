import { ErrorMessage } from '../constants/errorMessages/errorMessages.types'

export type AppErrorParams = { message: ErrorMessage; status?: number; details?: string }
