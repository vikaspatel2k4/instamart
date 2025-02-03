const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError = require("../utils/Expresserror.js");
const Review = require("../models/review.js");
const Listing = require('../models/listing');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const {listingSchema,reviewSchema} = require("../Schema.js");

const reviewController = require("../controllers/review.js");


//reviews ka post route
router.post("/", 
    isLoggedIn,
    validateReview ,
    wrapAsync(reviewController.createReview));

//delete review route 
router.delete("/:reviewId" , 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;