const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

//REVIEWS
//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.postReview));

//delete review route
router.delete("/:reviewId" ,isLoggedIn , isReviewAuthor,  wrapAsync( ReviewController.destroyReview));

module.exports = router;