const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const reviewSchema = require("../reviewschema.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    
    if(error) {
        next( new ExpressError( 400, error));
    } else{
        next();
    }
   
}


// Post Reviews Route
router.post("/reviews",validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review is saved");
    res.redirect(`/listings/${req.params.id}`);
}));

// Delete Reviw Route
router.delete("/reviews/:reviewId" , async(req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate( id, { $pull : {reviews : reviewId} });
  await Review.findByIdAndDelete( reviewId);

  res.redirect(`/listings/${id}`);
})

module.exports = router;