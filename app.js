const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listing = require("./routes/listing.js");
const review = require("./routes/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine( 'ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");
}
main().then(() => {
    console.log("mongo connected");
})

app.get("/", (req, res) => {
    res.send("Working");
})

app.use("/listings", listing);
app.use("/listings/:id", review);

app.all("*", (req, res, next) => {
    next( new ExpressError( 404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode=500 , message="Something Went Wrong" } = err;
    res.status( statusCode ).render("./listings/error.ejs", {message});
  });
app.listen( 8080, () => {
    console.log("app is listening");
})