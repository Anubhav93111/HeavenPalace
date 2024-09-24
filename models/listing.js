const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        reqired: true,
    },
    description: String,
    image: {
        type : String,
       default: "https://images.pexels.com/photos/3555615/pexels-photo-3555615.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        set: (v) => v === "" ? "https://images.pexels.com/photos/3555615/pexels-photo-3555615.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" : v,
    },
    price: Number,
    location: String,
    country: String, 
    reviews: [
        {
           type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
   
});

    
    listingSchema.post("findOneAndDelete", async(listing) => {
        if(listing) {
            await Review.deleteMany({ _id: { $in:listing.reviews}});
        }
    });


    const Listing = mongoose.model("Listing", listingSchema );
    module.exports = Listing;