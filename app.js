if(process.env.NODE_ENV != "production"){
   require("dotenv").config();
};

// const fs = require('fs');
// const path = require('path');

// const filePath = path.join(__dirname, 'config.json'); // Ensure correct path

// if (fs.existsSync(filePath)) {
//     const data = fs.readFileSync(filePath, 'utf-8');
//     console.log(data);
// } else {
//     console.error("File not found:", filePath);
// }

const express= require ("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require ("method-override");
const ejsMate = require ("ejs-mate");
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
   mongoUrl : atlasDb_url,
   crypto : {
      secret : process.env.SECRET,
   },
   touchAfter : 24*3600,
});

store.on("error" , () => {
   console.log("ERROR IN MONGO SESSION STORE" , err);
});

const sessionOptions = {
   store,
   secret: process.env.SECRET, 
   resave: false, 
   saveUninitialized: true,
   cookie: {
      expires : Date.now() * 7 * 24 * 60 * 60 * 1000, //after 7 days
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
   },
};

//const mongoDb_url = "mongodb://localhost:27017/wanderLust";
const atlasDb_url = process.env.ATLASDB_URL;

//mongodb connection
async function main(){
   await mongoose.connect(atlasDb_url);
}

main().then(() => {
   console.log("Connected to MongoDB");
})
.catch((err) => {
   console.log(err);
});

// app.get("/", (req,res) => {
//    res.send("Hello I am working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

//routes 
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.use("*", (req,res,next) => {
   next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
   let {statusCode = 500 , message = "some real shit error occured"} = err;
   //res.statusCode(500).send(message);
   res.status(statusCode).render("errors.ejs" , {message});
});

app.listen(8080 , () => {
   console.log("server is running on port 8080");
});