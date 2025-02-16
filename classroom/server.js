//
const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const cookieparser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieparser("secretcode"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOptions = {
   secret: "mysupersecretstring", 
   resave: false, 
   saveUninitialized: true,
};

// app.get("/", (req,res) => {
//    res.send("hello i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.get("/" , (req,res) => {
   console.dir(req.cookies);
   res.send("Hi , i am root!");
})

app.get("/getsignedcookie" , (req,res) => {
   res.cookie("username","john", {signed: true});
   res.cookie("age","30",{signed: true});
   res.send("signed cookie sent");
});

app.get("/verified" , (req,res) => {
   console.log(req.signedCookies);
   res.send("verified cookies");
});

app.get("/greet", (req,res) => {
   let {name = "anonymous"} = req.cookies;
   res.send(`Hello ${name}`);
});

//setting a middleware!
app.use((req,res,next) => { 
   res.locals.successMsg = req.flash("success");
   res.locals.errorsMsg = req.flash("error");
   next();
});

app.get("/register" , (req,res) => {
   let {name = "anonymous"} = req.query; 
   req.session.name = name;
   if (name == "anonymous") {
      req.flash("error", "user registration failed!");
   } else {
      req.flash("success", "new user registered");
   }
   console.log(name);
   res.redirect("/hello");
});

app.get("/hello" , (req,res) => {
   //res.send(`hello ${req.session.name}`);
   // res.locals.successMsg = req.flash("success");
   // res.locals.errorsMsg = req.flash("error");
   res.render("page.ejs", {name : req.session.name });
});

app.get("/getcookie" , (req,res) => {
   res.cookie("username","john");
   res.send("cookie sent");
});

app.get("/reqcount", (req,res) => {
   if(req.session.count){
      req.session.count++;
   } else {
      req.session.count = 1;
   }
   res.send(`You have visited this page ${req.session.count} times`);
});

app.get("/test" , (req, res) => {
   res.send("test successful");
});

app.get("/reqcount" , (req,res) => {
   res.send(`you sent a request x times`);
})

app.listen(3000, (req,res) => {
   console.log("server is running on port 3000");
});