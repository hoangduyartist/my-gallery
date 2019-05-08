var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true,
        // minlength : [4, 'at least 4 char']
    },
    age: {
        type: Number,
        //required: true
        //default: 20
    },
    contacts : [],
    friends : Array
});

// setter
// userSchema.path('name').set(inputString =>{
//     return inputString[0].toUpperCase()+inputString.slice(1);
// });
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });  
});

userSchema.pre("save",function(next) {
    var self = this;
    mongoose.models["users"].findOne({email : self.email},function(err, results) {
        if(err) {
            next(err);
        } else if(results) { //there was a result found, so the email address exists
            self.invalidate("email","email must be unique");
            return next(new Error("email must be unique"));
        } else {
            next();
        }
    });
    next();
});
module.exports = mongoose.model("users",userSchema) ;