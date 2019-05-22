const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./../models/user');

module.exports = {
    authenticate,
    create
};

async function authenticate({name, password}){
    const user = await User.findOne({name:name})
    if(!user)
    return ({msg:'user-name is incorrect !'})
    
    if (user && bcrypt.compareSync(password, user.password)) {
        return {
            session:user._id,
            user,
            msg:'OK'
        };
    }

    return ({msg:'password is incorrect !'});
}
async function create(userParams){
    // validate
    if (await User.findOne({ name: userParams.name })) {
        // throw 'Username "' + userParams.name + '" is already taken'; //will be catched in .catch()
        return ({msg : 'Username "' + userParams.name + '" is already taken'})
    }

    const user = new User({
        _id : new mongoose.Types.ObjectId(),
        fullname : userParams.fullname,
        name : userParams.name,
        password : userParams.password
    });
    // hash password //in schema
    // save user
    const newuser = await user.save();
    if(newuser)
    return ({newUser:newuser, msg:'Register successful !'})
    return ({msg: 'Register failed !'})
}