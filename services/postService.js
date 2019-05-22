const mongoose = require("mongoose");

const Image = require("../models/image");
const Post = require("../models/post");

module.exports = {
    createImg,
    createStt,
    fetchWithUser,
    fetchAll,
    del,
    share,
    createImg
};

async function createImg(postParams){

    const post = new Post({
        _id: postParams._id,
        userID: postParams.userID,
        type:'image',
        description: postParams.description,
        content:postParams.content,
    });
    // save img
    const newPost = await post.save();
    if(newPost)
    return ({newPost:newPost, msg:'Post successful!'})
    return ({msg: 'Post failed !'})
}

async function createStt(postParams){

    const post = new Post({
        _id: postParams._id,
        userID: postParams.userID,
        type:'status',
        description: postParams.description,
        content:postParams.content,
    });
    // save img
    const newPost = await post.save();
    if(newPost)
    return ({newPost:newPost, msg:'Post successful!'})
    return ({msg: 'Post failed !'})
}

async function fetchWithUser(userID){
    // console.log(userID);
    let userPost = await Post.find({userID:userID})
    if(userPost) {
        return ({posts:userPost, msg: 'user-post loaded'});
    }

    return ({msg: 'you have no post.'})
}

async function fetchAll(){
    // console.log(userID);
    let posts = await Post.find({})
    if(posts) {
        return ({posts:posts, msg: 'All-post loaded'});
    }
    return ({msg: 'we have no post.'})
}

async function del(imgID){

    if(await Image.findByIdAndRemove(imgID)) {
        return ({msg: 'img deleted successfully'});
    }

    return ({msg: 'No image is deleted.'})
}

async function share(imgID){

}