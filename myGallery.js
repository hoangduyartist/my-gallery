//basic depens
const express = require('express');
const app = express();
const server = require("http").Server(app);
//basic depens
var io = require("socket.io")(server); //socket.io
var mongoose = require("mongoose"); //mongoDB DOM

const bodyParser = require("body-parser");

var session = require("express-session");
const path = require("path");
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
    fileFilter: function(req, file, cb){
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

//global store
let images = [];
//end global store
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "secretSessionTest", resave: false, saveUninitialized: true }));
// check login middleware
// ....
server.listen(process.env.PORT || 3000);
// server.listen(3000);

let urlMongo = "mongodb://localhost:27017/node_chat";
mongoose.Promise = global.Promise;
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    ()=>{
        console.log('connect OK');
    }
)
.catch(connectError=>connectError);

app.get('/', (req, res) => {
    res.render('main',{msg: 'loaded', images: images})
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('main', {msg: err});
        } else {
            if (req.file == undefined) {
                res.render('main', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                console.log(req.file);
                //UI
                let imgUI = {
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
                // res.render('main', {
                //     msg: 'File Uploaded!',
                //     file: `uploads/${req.file.filename}`,
                //     images: images
                // });
                res.redirect('/');
            }
        }
    });
});