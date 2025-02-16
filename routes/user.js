const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/users");

router
   .route("/signup")
   .get( userControllers.rendersignupForm  )
   .post( wrapAsync(userControllers.signupPage));


router
   .route("/login")
   .get( userControllers.renderLoginForm)
   .post( saveRedirectUrl, passport.authenticate("local", {
      failureRedirect : "/login", 
      failureFlash : true,
      }),
      userControllers.loginPage
   );

router.get("/logout" , userControllers.logoutPage )

module.exports = router;

// router.post("/login", (req, res, next) => {
//    passport.authenticate("local", (err, user, info) => {
//       if (err) return next(err);
//       if (!user) {
//          req.flash("error", "Invalid username or password");
//          return res.redirect("/login");
//       }
//       req.logIn(user, (err) => {
//          if (err) return next(err);
//          req.flash("success", "Welcome to Wanderlust, you are logged in!");
//          return res.redirect("/listings");
//       });
//    })(req, res, next);
// });

// router.post("/login", async (req, res) => {
//    const user = await User.findOne({ username: req.body.username });
//    if (!user) {
//       req.flash("error", "User not found");
//       return res.redirect("/login");
//    }
//    console.log("User found:", user);
//    res.redirect("/listings");
// });

