const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url:String,
        filename:String,
    },

    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, //yaha reference dena jaruri hai yaad rakhna we got an error due to this only
            ref: "Review" ,
        }
    ],

    owner: {
        type : Schema.Types.ObjectId,
        ref : "User",
    },

    geometry:  {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    

});
//mongoose se middleware add kar rahe hai 
//isse ham listing ke saath sath un reviews ko bhi delete kar sakte hai 
listingSchema.post("findOneAndDelete" , async(listing) =>{
    if (listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
