const initData = require("./data.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("connected to database");
        return initDb(); // Ensure initDb is called after the database connection
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner :"6797561f608d76bb003363f3" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized"); // Fixed typo
};

