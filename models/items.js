
var mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
    name: {
        type : String
    },
    type: {
        type: String,
        required: true
    }
});
// setter
// userSchema.path('name').set(inputString =>{
//     return inputString[0].toUpperCase()+inputString.slice(1);
// });
module.exports = mongoose.model("items",itemSchema) ;