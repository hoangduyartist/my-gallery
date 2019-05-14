const express = require("express");
const app = express.Router();

const User = require('../models/user');

let images = [];

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
    return res.render('authenticate');
    res.render('authenticate', { err: '', isReg: false, loginSuccess: true });
});
app.post('/login', function (req, res) {
    // const user = require('../models/user');
    User.findOne({ name: req.body.name }, (e, userFound) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        }
        if (!userFound) {
            // return res.status(404).send('User not found');
            return res.render('authenticate', { status: 'login', msg: 'User is not found !' });
        }
        const bcrypt = require('bcrypt');
        bcrypt.compare(req.body.password, userFound.password, (e1, rs) => {
            if (rs == true) {
                // return res.send('Correct pass');
                req.session.userID = userFound._id;
                req.session.userProfile = userFound;
                currentUser = userFound._id;

                return res.redirect('/');

            }
            // return res.send('Incorrect pass');
            return res.render('authenticate', { status: 'login', msg: 'Password is incorrect !' });
        })
    });

});
app.post('/register', function (req, res) {

    // const user = require('../models/user');
    let mongoose = require('mongoose');
    let mUser = new User();
    mUser._id = new mongoose.Types.ObjectId();
    mUser.fullname = req.body.fullname;
    mUser.name = req.body.name;
    mUser.password = req.body.password;
    mUser.save((e, rs) => {
        if (!e){
            console.log('Register new usr '+rs);
            return res.render('authenticate', { status: 'register', msg: 'Register successful !' });
        }
            
        else {
            console.log(e.message);
            return res.render('authenticate', { status: 'register', msg: 'Register failed !' });
        }
    });

});

app.get('/myhome', (req, res) => {
    res.render('main', { msg: 'loaded', images: images })
});

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
            res.render('main', { msg: err });
        } else {
            if (req.file == undefined) {
                res.render('main', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                console.log(req.file);
                //UI
                let mongoose=require("mongoose");
                let imgUI = {
                    
                    _id: mongoose.Types.ObjectId(),
                    path: `uploads/${req.file.filename}`,
                    name: req.file.filename,
                    description: req.body.description
                }
                images.push(imgUI);
                // console.log(images);
                //end UI

                //insert in database
                // const user = require('./models/user');
                // let mUser = new user();
                // mUser.fullname=req.body.fullname;
                // mUser.name=req.body.name;
                // mUser.password=req.body.password;
                // mUser.save((e, rs)=>{
                //     if(!e)
                //     //  res.send(rs);
                //     res.render('authenticate', {err: '', isReg:true, regSuccess:true });
                //     else{
                //         console.log(e.message);
                //         res.render('authenticate', {err: e, isReg:true, regSuccess:false });
                //     } 
                // });
                res.render('main', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`,
                    images: images
                });
                // res.redirect('/myhome');
            }
        }
    });
});
// /del-img/5cda48ec0d896f2fa08b7bb0
app.get('/del-img/:imgID.:key',(req,res)=>{
    
    // delete file on server
    let fs = require("fs");
    // console.log(images[req.params.key].path);
    fs.stat(`./public/${images[req.params.key].path}`, function (err, stats) {
        // console.log(stats);//here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }
        fs.unlink(`./public/${images[req.params.key].path}`,function(err){
             if(err) return console.log(err);
             //  delete UI
             images.splice(req.params.key,1);
            //  setTimeout(()=>{       
            //     },3000)
                // del in database here
                // res.render('main', { msg: 'loaded', images: images }) //req in address is NOT changed
                console.log('file deleted successfully');
                return res.redirect('/myhome');   
        });  
     });
    
    // res.send('deleted '+req.params.imgID+'with key '+req.params.key);
})

module.exports = app;