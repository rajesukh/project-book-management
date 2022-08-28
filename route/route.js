const express = require("express")

const router = express.Router()
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/auth")


let {authentication,authorization} = middleware
let {createBook,getBooks,getBookDetailsById,updateBookById,deleteBookById} = bookController
let {createUser,loginUser}= userController
let {craeteReview,updateReview,deleteReview} = reviewController


router.post("/register",createUser)
router.post("/login",loginUser)
router.post("/books",authentication,createBook)
router.get("/books",authentication,getBooks)
router.get("/books/:bookId",authentication,getBookDetailsById)
router.put("/books/:bookId",authentication,authorization,updateBookById)
router.delete("/books/:bookId",authentication,authorization,deleteBookById)
router.post("/books/:bookId/review",craeteReview)
router.put("/books/:bookId/review/:reviewId",updateReview)
router.delete("/books/:bookId/review/:reviewId",deleteReview)

module.exports = router