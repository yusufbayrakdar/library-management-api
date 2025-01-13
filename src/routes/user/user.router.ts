import bookController from '../../controllers/book.controller'
import userController from '../../controllers/user.controller'
import validator from '../../middlewares/validatorMiddleware/validator.middleware'
import { VALIDATION_SOURCE } from '../../middlewares/validatorMiddleware/validator.middleware.types'
import AppRouter from '../../utils/appRouter/appRouter'
import bookSchemas from '../../utils/validationSchemas/book/book.validationSchemas'
import commonSchemas from '../../utils/validationSchemas/common.validationSchemas'
import userSchemas from '../../utils/validationSchemas/user/user.validationSchemas'

const userRouter = AppRouter()

userRouter.get('/', userController.getUsers)
userRouter.get(
	'/:id',
	validator({ schema: commonSchemas.Id, source: VALIDATION_SOURCE.PARAMS }),
	userController.getUser,
)
userRouter.post('/', validator({ schema: userSchemas.UserCreateSchema }), userController.createUser)
userRouter.post(
	'/:id/borrow/:bookId',
	validator({ schema: bookSchemas.BorrowingParams, source: VALIDATION_SOURCE.PARAMS }),
	bookController.borrowBook,
)
userRouter.post(
	'/:id/return/:bookId',
	validator({ schema: bookSchemas.BorrowingParams, source: VALIDATION_SOURCE.PARAMS }),
	validator({ schema: bookSchemas.BookReturnSchema }),
	bookController.returnBook,
)

export default userRouter.getRouter()
