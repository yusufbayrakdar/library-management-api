import bookController from '../../controllers/book.controller'
import validator from '../../middlewares/validatorMiddleware/validator.middleware'
import { VALIDATION_SOURCE } from '../../middlewares/validatorMiddleware/validator.middleware.types'
import AppRouter from '../../utils/appRouter/appRouter'
import bookSchemas from '../../utils/validationSchemas/book/book.validationSchemas'
import commonSchemas from '../../utils/validationSchemas/common.validationSchemas'

const bookRouter = AppRouter()

bookRouter.get('/', bookController.getBooks)
bookRouter.get(
	'/:id',
	validator({ schema: commonSchemas.Id, source: VALIDATION_SOURCE.PARAMS }),
	bookController.getBook,
)
bookRouter.post('/', validator({ schema: bookSchemas.BookCreateSchema }), bookController.createBook)

export default bookRouter.getRouter()
