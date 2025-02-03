const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


const {listingSchema,reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/Expresserror.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("index.ejs", { allListings });
};
module.exports.renderNewForm = (req,res) =>{
    res.render("new.ejs");
};
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews",
    populate:{
        path : "author",
    },
    }) 
    .populate("owner");
    if (!listing) {
        req.flash("error" ,  "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    //populate yaha pe andar ke pure o bject ko khol deta hai 
    res.render("show.ejs", {listing});
};
module.exports.createListing = async(req,res,next) =>{
   
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location, //kyoki hame is listing ke coordinates chiye
        limit: 1,
      })
        .send()
    
        res.redirect("/listings")
        
   
    let url = req.file.path;
    let filename = req.file.filename;
    
    //ye ham jab dalenge jab ham hopscoth ya dusre platform se req bhejre ho waha pe proper error show na hora ho
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400 ,result.error );
    }
    const newListing = new Listing(req.body.listing); //reqbodylisting = hamne title or descriptions sabhi ko listing ki body me object ki tarah save kardiya h
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm =  async (req,res) =>
{ 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let origionalImageUrl = listing.image.url;
   origionalImageUrl = origionalImageUrl.replace("/upload","/upload/w_250")
    res.render("edit.ejs" , {listing , origionalImageUrl});
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
     
     if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
     }
     req.flash("success" , "Listing Updated");
    res.redirect("/listings");
};
module.exports.deleteListings = async (req, res) => { 
    let { id } = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "listing deleted");
     res.redirect("/listings"); 
    };