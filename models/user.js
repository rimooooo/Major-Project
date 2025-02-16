const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
   email : {
      type : String,
      required : true,
   },
   // username and password and hashing and salting , passport khud hi kar dega 
   // so no need to write the username or password.
   // and also implement various functions , like authenticate() etc.
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);