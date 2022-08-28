// Create review
const Validator = require("../controllers/bookController");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose")

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

//❌❌❌❌❌❌❌❌❌❌=========== Create Review ==========❌❌❌❌❌❌❌❌❌❌//

const craeteReview = async (req, res) =>{
  try {
    let bookId = req.params.bookId;
    let requestBody = req.body;

    if (!bookId)
      return res
        .status(400)
        .send({ status: false, message: "please give BookId" });
    if (!Validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is not a valid Book id" });
    }

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).send({ status: false, message: "Book not found" });
    }

    if (!Validator.isValidBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameter, please provide Review Details",
      });
    }

    let { reviewedBy, rating, review } = requestBody;

    if (!review) {
      return res
        .status(400)
        .send({ status: false, message: " please provide Review for this book" });
    }
    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: " please provide rating for this book" });
    }

    if ((rating === 1 || rating === 2 || rating === 3 || rating === 4 || rating === 5)) {
      rating=rating
   }else{
    return res.status(400).send({
      status: false,
      message:
        " please provide rating between 1 to 5 and type should be Number",
    });
   }

    let createReviewdata = {
      bookId: bookId,
      reviewedBy: reviewedBy,
      reviewedAt: Date.now(),
      rating: rating,
      review: review,
    };
    let reviewdata = await reviewModel.create(createReviewdata);

    await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: 1 } }
    );

    let newdata = await reviewModel
      .find(reviewdata)
      .select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });

    res.status(201).send({ status: true, message:"Done", data: newdata });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//❌❌❌❌❌❌❌❌❌❌===========Review  update==========❌❌❌❌❌❌❌❌❌❌//

const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let requestBody = req.body;
    if (!Validator.isValidBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "There is no data is input for updating",
      });
    }

    let key= Object.keys (requestBody)
    
    for(let i=0; i<key.length; i++){
       if(requestBody[key[i]].length==0)
      return res.status(400).send({status: false, message: "Enter valid inforamtion "})
    }

    // params
    if (!bookId)
      return res
        .status(400)
        .send({ status: false, message: "BookId is required" });
    if (!Validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid book id" });
    }

    if (!reviewId)
      return res
        .status(400)
        .send({ status: false, message: "ReviewId is required" });
    if (!Validator.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Review id" });
    }

    let checkDeletedBook = await bookModel.findOne({ _id: bookId, isDeleted: true });
    if (checkDeletedBook) {
      return res
        .status(400)
        .send({ status: false, message: "Book has already been deleted." });
    }

    let checkReviewDeleted = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: true,
    });
    if (checkReviewDeleted) {
      return res
        .status(400)
        .send({ status: false, message: "Review has already been deleted." });
    }

    let isReviewId = await reviewModel.findById({ _id: reviewId });

    if (bookId != isReviewId.bookId) {
      return res.status(400).send({
        status: false,
        message: "This review not belongs to this particular book.",
      });
    }
    // body
    
    requestBody = JSON.parse(JSON.stringify(requestBody).replace(/"\s+|\s+"/g,'"'))
    let { review, rating, reviewedBy } = requestBody;
    if (review) {
      if (!typeof review == String)
        return res.status(400).send({
          status: false,
          message: "Valid review is required for updatation.",
        });
    }
    let obj = {};
    obj.review = review;
    if (typeof rating == "number") {
      if (rating >= 1 && rating <= 5) {
        obj.rating = rating;
      } else {
        return res.status(400).send({
          status: false,
          message:
            " please provide rating between 1 to 5 and type should be Number",
        });
      }
    }
    if (reviewedBy) {
      if (!typeof reviewedBy == String) {
        return res.status(400).send({
          status: false,
          message: "Valid reviewer name is required for updatation.",
        });
      }
    }
    obj.reviewedBy = reviewedBy;

    const updatedTheReview = await reviewModel.findOneAndUpdate(
      { _id: req.params.reviewId },
      obj,
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Successfully updated review details",
      data: updatedTheReview,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, Error: err.message });
  }
};

//❌❌❌❌❌❌❌❌❌❌===========Review  Delete ==========❌❌❌❌❌❌❌❌❌❌//

const deleteReview = async function (req, res) {
  try {
    bookId = req.params.bookId;
    reviewId = req.params.reviewId;

    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ statuts: false, message: "bookId is not valid" });
    }
    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ statuts: false, message: "reviewId is not valid" });
    }
    let checkReviewId = await reviewModel.findOne({
      _id: reviewId,
      bookId: bookId,
      isDeleted: false,
    });
    if (!checkReviewId) {
      return res
        .status(400)
        .send({ status: false, message: "no review of this bookId exist" });
    }

    let checkBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!checkBookId) {
      return res.status(400).send({
        status: false,
        message: "book with given bookId does not exist",
      });
    }

    let updateReviewStatus = await reviewModel.findOneAndUpdate(
      { _id: reviewId },
      { isDeleted: true },
      { new: true }
    );
    let updateReviewCount = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { reviews: checkBookId.reviews - 1 },
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "review deleted",
      data: updateReviewStatus,updateReviewCount
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.craeteReview = craeteReview;
module.exports.deleteReview = deleteReview;
module.exports.updateReview = updateReview;