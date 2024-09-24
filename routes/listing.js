const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../listingschema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    
    if(error) {
        next( new ExpressError( 400, error));
    } else{
        next();
    }
   
}

// Index Route
router.get("/",  wrapAsync(async (req, res) => {
    const allListings =  await Listing.find({})
       
     res.render("./listings/index.ejs", { allListings });
 }));
 
 // Add Route
 router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
 })
 
 router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    
   
     const newListing = new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
   }));
 
 // Show Route
 router.get("/:id",  wrapAsync(async (req, res) => {
     let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
 }));

 // Edit Route
router.get("/:id/edit",  wrapAsync(async(req, res) => {
    let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("./listings/edit.ejs", { listing});
}));

// Update Route
router.put("/:id",validateListing,  wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id",  wrapAsync(async(req, res) => {
    let {id} = req.params;
   
    let deletedlist =  await Listing.findByIdAndDelete(id) ;
    console.log( deletedlist );
    res.redirect("/listings");
}));

module.exports = router;