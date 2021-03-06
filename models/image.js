
var mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
        default: 'Caption description'
        
    },
    album: {type: String, default: 'default album'}
});
// setter
// userSchema.path('name').set(inputString =>{
//     return inputString[0].toUpperCase()+inputString.slice(1);
// });
module.exports = mongoose.model("images",imageSchema) ;