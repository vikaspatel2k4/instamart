const { model } = require("mongoose");
const Listing = require("./models/listing");
const ExpressError = require("./utils/Expresserror.js");
const {listingSchema,reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user); //it will take the info of user
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listings");
       return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing = (req,res,next) =>{
    let{error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }
};
module.exports.validateReview = (req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }
};
module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewid} = req.params;
    let listing = await Review.findById(id);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
};