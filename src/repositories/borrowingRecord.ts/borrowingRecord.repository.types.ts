import Book from '../../entities/book.entity'
import User from '../../entities/user.entity'

export type CreateBorrowingRecordParams = {
	user: User
	book: Book
}
