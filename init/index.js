const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


async function main(){
   await mongoose.connect("mongodb://localhost:27017/wanderLust");
}

main().then(() => {
   console.log("Connected to MongoDB");
})
.catch((err) => {
   console.log(err);
});

const initDb = async () => {
   await Listing.deleteMany();
   initData.data = initData.data.map((obj) => ({...obj , owner : "67a3bff7e077d6e77c407f7d"}));
   await Listing.insertMany(initData.data);
   console.log("Database initialized");
};

initDb();