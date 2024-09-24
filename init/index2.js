const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");
}
main().then(() => {
    console.log("mongo connected");
})

const initDB = async () => {
   
   await Listing.insertMany( initData.data);
   console.log("Data was Initialised");
}
initDB();