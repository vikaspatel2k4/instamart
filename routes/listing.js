if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
};

const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/WrapAsync.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const {listingSchema,reviewSchema} = require("../Schema.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
//ye hamari temporary chij hai actually me agar hamko file save arwani hogi to
// ham koi third party cloud space use karte 
const upload = multer({storage});

//it let us to create only one path and we can embbed different requests
router
.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createListing));


//get request from index.ejs form going to new.ejs form
 router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( 
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
        isLoggedIn, wrapAsync(listingController.deleteListing));

//get request for going from show.ejs form to edit.ejs form
router.get("/:id/edit" ,isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;
