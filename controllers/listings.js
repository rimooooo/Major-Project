const Listing = require("../models/listing");


module.exports.index = async (req,res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req,res) => {
   res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id)
      .populate({path : "reviews", 
         populate : { 
            path: "author"
         },
      })
      .populate("owner");
   if(!listing){
      req.flash("error" , "Listing you searching for does not exist!");
      res.redirect("/listings");
   }
   //console.log(listing.owner.username);
   res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res) => {
   //let {title,desccription,price,country,image,location} = req.body;
   //let listing = req.body.listing;
   let url = req.file.path;
   let filename = req.file.filename;
   // console.log(url , ".." , filename);
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = {url , filename};
   await newListing.save();
   req.flash("success" , "New listing created!");
   res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error" , "Listing you want to update does not exist!");
      res.redirect("/listings");
   }
   //console.log(listing.image.url);
   let originalUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
   //console.log(originalUrl);
   res.render("listings/edit.ejs", { listing , originalUrl });
};

module.exports.updateListing = async (req,res) => {
   let {id} = req.params;
   //await Listing.findById(id);
   
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if(req.file){ 
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};  
   }
   await listing.save();
   
   req.flash("success" , "Listing got Updated!");
   res.redirect(`/listings/${id}`);
}; 

// module.exports.updateListing = async (req, res) => {
//    let { id } = req.params;

//    // Find listing by ID
//    let listing = await Listing.findById(id);
//    if (!listing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//    }

//    // Update listing details from the form
//    listing.title = req.body.listing.title;
//    listing.description = req.body.listing.description;
//    listing.price = req.body.listing.price;
//    listing.location = req.body.listing.location;
//    listing.country = req.body.listing.country;

//    // If a new file was uploaded, update the image
//    if (req.file) {
//       listing.image = { url: req.file.path, filename: req.file.filename };
//    }

//    await listing.save();  // Ensure the changes are saved

//    req.flash("success", "Listing updated successfully!");
//    res.redirect(`/listings/${id}`);
// };


module.exports.destroyListing = async(req,res) => {
   let {id} = req.params;
   let deletedList = await Listing.findByIdAndDelete(id);
   req.flash("success" , "Listing got deleted!");
   console.log (deletedList);
   res.redirect("/listings");
};

