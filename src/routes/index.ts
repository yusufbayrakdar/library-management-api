import express from 'express'

import bookRouter from './book/book.router'
import userRouter from './user/user.router'

const router = express.Router()

// [WARNING] Using routes for the same endpoint can cause unwanted results
router.use('/users', userRouter)
router.use('/books', bookRouter)

export default router
