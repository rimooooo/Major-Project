const User = require("../models/user");

module.exports.rendersignupForm = (req,res) => {
   res.render("users/signup.ejs");
};

module.exports.signupPage = async (req,res) => {
   try{
      const {username , email , password} = req.body;
      const newUser = new User({email, username});
      const registeredUser = await User.register(newUser, password);
      console.log (registeredUser);
      req.login(registeredUser, (err) => {
         if(err){
            return next(err);
         }
         req.flash("success" , "Welcome to wanderLust");
         res.redirect("/listings");
      });
      } 
      catch(e){
         req.flash("error" , e.message);
         res.redirect("/signup");
      }
};

module.exports.renderLoginForm = (req,res) => {
   res.render("users/login.ejs");
};

module.exports.loginPage = async (req,res) => {
   //console.log("User logged in:", req.user); // Debugging
   req.flash("success" , "Welcome to wanderlust, you are logged in!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logoutPage = (req,res,next) => {
   req.logout((err) => {
      if(err){
         return next(err);
      }
      req.flash("success" , "You have logged out!");
      res.redirect("/listings");
   });
};

