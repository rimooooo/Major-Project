const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
//const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage });

router
   .route("/")
   .get( wrapAsync( listingController.index ))
   .post(isLoggedIn,  upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
   .delete(isLoggedIn, isOwner,  wrapAsync(listingController.destroyListing));

//EDIT ROUTE 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// router.get("/testListing", async (req,res) => {
//    let sampleListing = new Listing ({
//       title: "Sample Listing",
//       description: "This is a sample listing",
//       price: 100,
//       location: "Sample Location",
//       country: "india"
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("Sample listing saved");
// });

module.exports = router;