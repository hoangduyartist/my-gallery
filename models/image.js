var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    userID: {
        type : String
    },
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        // unique: true
    },
    caption: {
        type: String,
        required: true,
        default: 'Caption default'
        // minlength : [4, 'at least 4 char']
    },
    description: {
        type: String,
        required: true,
        default: 'Caption description'
        
    },
    album: {type: String, default: 'default album'}
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


module.exports = mongoose.model("images",imageSchema) ;