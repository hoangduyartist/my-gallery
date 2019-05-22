
var mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type : String
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'Caption description'
    },
    content : {
    },
    album: {type: String, default: 'default album'}
});
// setter
// userSchema.path('name').set(inputString =>{
//     return inputString[0].toUpperCase()+inputString.slice(1);
// });
module.exports = mongoose.model("posts",postSchema) ;