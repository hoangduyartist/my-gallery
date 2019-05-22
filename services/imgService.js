const mongoose = require("mongoose");

const Image = require("../models/image");
const Post = require("../models/post");

module.exports = {
    create,
    fetchWithUser,
    del,
    share
};

async function create(imgParams){

    const image = new Image({
        _id: imgParams._id,
        userID: imgParams.userID,
        path: imgParams.path,
        name: imgParams.name,
        description: imgParams.description
    });
    // save img
    const newImg = await image.save();
    if(newImg)
    return ({newImg:newImg, msg:'File Uploaded!'})
    return ({msg: 'Upload failed !'})
}

async function fetchWithUser(userID){
    // console.log(userID);
    let userImg = await Image.find({userID:userID})
    if(userImg) {
        return ({images:userImg, msg: 'user-img loaded'});
    }

    return ({msg: 'you have no image.'})
}

async function del(imgID){

    if(await Image.findByIdAndRemove(imgID)) {
        return ({msg: 'img deleted successfully'});
    }

    return ({msg: 'No image is deleted.'})
}

async function share(imgID){

    // if(await Image.findById(imgID)) {
        
    // }

    // return ({msg: 'No image is deleted.'})
}