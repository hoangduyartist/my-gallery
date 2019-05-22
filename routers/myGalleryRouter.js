const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");

const User = require('../models/user');
const userService = require('./../services/userService');
const imgService = require('./../services/imgService');
const postService = require('./../services/postService');


let images = [];
let posts = [];

isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userID) {
        console.log('loged in');
        return next();
    }
    console.log('please login');
    return res.redirect('/login');
}
app.get('/', isLoggedIn, (req, res) => {
    let test = async () => {
        let contacts = [];
        await Promise.all(req.session.userProfile.contacts.map(async (item) => {
            // let User = require('../models/user');
            await User.findById(item.userID, { fullname: true, name: true }, function (err, usrContact) {
                if (usrContact) {
                    contacts.push(usrContact);
                    console.log(usrContact);
                }
            })
        }))
        // return res.status(200).send('ok');
        console.log('done');
        // userContacts = contacts;
        return res.status(200).send('OK');
    }
    test();
    // res.status(200).send('OK, hello ' + req.session.userID);
})
app.get('/t', function (req, res) {
    res.send(req.session.userID + " " + req.session.userProfile.fullname);
})
app.get('/logout', function (req, res) {
    req.session.destroy();
    if (req.session && req.session.userID)
        res.send(req.session.userID);
    else res.redirect('/');
});
app.get('/login', function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    return res.render('pages/authenticate');
    res.render('authenticate', { err: '', isReg: false, loginSuccess: true });
});
app.post('/login', function (req, res, next) {

    userService.authenticate(req.body)
        .then(data => {
            if (data.user) {
                req.session.userID = data.session;
                req.session.userProfile = data.user;
                // currentUser = userFound._id;
                return res.redirect('/myhome');
            }

            return res.render('pages/authenticate', { status: 'login', msg: data.msg });
        })
        .catch(err => next(err))
});
app.post('/register', function (req, res) {

    userService.create(req.body)
        .then((data) => {
            if (data.newUser) {
                return res.render('pages/authenticate', { status: 'register', msg: data.msg });
            } else {
                console.log(data);
                return res.render('pages/authenticate', { status: 'register', msg: data.msg });
            }
        })
        .catch(err => console.log(err))

});

app.get('/myhome', (req, res) => {
    let fetch = async function (){
        await imgService.fetchWithUser(req.session.userID)
        .then(data=>{
            images=data.images;
        })
        .catch(err=>console.log(err))
        // return res.render('components/userhome/userHome', {user: req.session.userProfile, msg: 'loaded', images: images, posts: posts });

        await postService.fetchWithUser(req.session.userID)
        .then(data=>{
            console.log(data.posts);
            posts=data.posts;
        })
        .catch(err=>console.log(err))
        return res.render('components/userhome/userHome', {user: req.session.userProfile, msg: 'loaded', images: images, posts: posts });
    }
    fetch();
    
});

app.get('/home', (req,res)=>{
    postService.fetchAll()
    .then(data=>{
        if(data.posts){
            return res.render('components/home/galleryHome', {user: req.session.userProfile, msg: 'public-post loaded', posts: posts });
        }
    })
    .catch(err=>console.log(err))

})


let path = require("path");
//upfile with multer
const multer = require("multer");
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        //   fieldname is name of input on client //myImage  
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    // limits: { fileSize: 100000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage'); //name of input on client

//functions
// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only!');
    }
}
//end functions

app.post('/upload', (req, res) => {

    upload(req, res, (err) => {
        // console.log(path);
        if (err) {
            res.render('components/userhome/userHome', { msg: err });
        } else {
            if (req.file == undefined) {
                res.render('components/userhome/userHome', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                // console.log(req.file);
                //UI
                let mongoose = require("mongoose");
                let imgUI = {

                    _id: mongoose.Types.ObjectId(),
                    userID: req.session.userID,
                    path: `uploads/${req.file.filename}`,
                    name: req.file.filename,
                    description: req.body.description
                }
                images.push(imgUI);
                //end UI

                imgService.create(imgUI)
                    .then(data => {
                        if (data.newImg) {
                            
                            res.render('components/userhome/userHome', {
                                user: req.session.userProfile,
                                msg: 'File Uploaded!',
                                file: `uploads/${req.file.filename}`,
                                images: images
                            });
                            console.log('upload done');
                        } else {
                            console.log('upload failed');
                        }
                    })
                    .catch(err => console.log(err))
                // res.redirect('/myhome');
            }
        }
    });
});
// /del-img/5cda48ec0d896f2fa08b7bb0
app.get('/del-img/:imgID.:key', (req, res) => {
    
    // delete file on server
    let fs = require("fs");

    fs.stat(`./public/${images[req.params.key].path}`, function (err, stats) {
        // console.log(stats);//here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }
        fs.unlink(`./public/${images[req.params.key].path}`, function (err) {
            if (err) return console.log(err);
            //  delete UI
            images.splice(req.params.key, 1);
            // del in database here
            // res.render('main', { msg: 'loaded', images: images }) //req in address is NOT changed
            imgService.del(req.params.imgID)
            .then(data=>{
                // console.log('file deleted successfully');
                console.log(data.msg);
                return res.redirect('/myhome');
            })
            .catch(err=>console.log(err))
            
        });
    });

    // res.send('deleted '+req.params.imgID+'with key '+req.params.key);
})
app.get('/share-img/:imgID.:key', (req, res) => {

    let fs = require("fs");
    // console.log(images[req.params.key].path);
    fs.stat(`./public/${images[req.params.key].path}`, function (err, stats) {
        // console.log(stats);//here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }
        let post = {

            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            type : 'image',
            description : 'you have shared an image.',
            content: images[req.params.key],
        }
        posts.push(post);

        postService.createImg(post)
        .then(data=>{
            if(data.newPost){
                // console.log(data.msg);
                res.redirect('/myhome');
            }else {

            }
        })
        .catch(err=>console.log(err))
        // console.log('img shared successfully');
        // res.redirect('/myhome');
    });

})

app.post('/upload-stt',(req,res)=>{
    let post = {

        _id: mongoose.Types.ObjectId(),
        userID: req.session.userID,
        type : 'status',
        description : req.body.description,
        content: {},
    }
    posts.push(post);

    postService.createStt(post)
    .then(data=>{
        if(data.newPost){
            return res.redirect('/myhome');
        }
    })
    .catch(err=>console.log(err))

})

module.exports = app;