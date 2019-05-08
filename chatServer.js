const express = require('express');
const app = express();

var server = require("http").Server(app);
// or var http = require('http').globalAgent.maxSockets=Infinity;
var io = require("socket.io")(server);

var mongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");

var bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

var session = require("express-session");

app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }) );
app.use(session({secret: "secretSessionTest", resave:false, saveUninitialized:true}));
// check login middleware
// ....
server.listen(process.env.PORT || 3000);
// server.listen(3000);

//store
// {name:'admin', avaLink:'abc'}
let usrArray = [];
let currentUser ='';
let userContacts;

//schemas
const User = require('./models/user');

//endSchema

let urlMongo = "mongodb://localhost:27017/node_chat";
mongoose.Promise = global.Promise;
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    () => {
        console.log("connect OK");
        
        //connect to server
        io.sockets.on("connection", (socket) => {
            //server send socketID back to client who connected
            //socket.emit("S-send-socketID",socket.id);
            console.log("client above " + socket.id + " connected.");
            //disconnect
            socket.on("disconnect", () => {
                console.log("client " + socket.id + " disconnected.");
            });
            socket.on("C-register", data => {
                let regStatus = true;
                usrArray.forEach((item, key) => {
                    if (item.name === data.name) {
                        //register failed
                        socket.emit('C-register-failed');
                        regStatus = false;
                    }
                })
                if (regStatus) {
                    // register success
                    socket.emit('C-register-success', data);
                    usrArray.push(data);
                    //server send data back to all clients
                    io.sockets.emit("S-send-contact-all", usrArray);
                }
            })
            socket.on('C-send-mes', data => {
                // server send data back to current client (only you)
                socket.emit("S-send-mes-cur-C", data);
                //server send data back to other clients except you
                socket.broadcast.emit("S-send-mes-all", data);
            })
            ////chat main ////////////////
            socket.emit('load-contacts', userContacts);
        });
    },
    err => {
        console.log("connect failed");
    }
);

//////////functions


//////////end Function

app.get('/inc', function (req, res) {
    res.render('chatInc');
});
app.get('/ui', function(req,res){
    res.render('chat1');
})

isLoggedIn = (req,res,next) => {
    if (req.session && req.session.userID) {
        console.log('loged in');
        return next();
    }
    console.log('please login');
    return res.redirect('/login');
}
app.get('/',isLoggedIn, function (req, res) {
    let test = async ()=>{
        let contacts = [];
        
        await Promise.all( req.session.userProfile.contacts.map(async (item)=>{
            
            await User.findById(item.userID,{fullname:true, name:true}, function(err,usrContact){
                if(usrContact){
                    contacts.push(usrContact);
                    // console.log(usrContact);
                }                        
            })
            
        }))
        
        console.log('done');
        userContacts=contacts;
        
        return res.render('chat1');
         
    }
    test();
    
});
app.get('/login', function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    res.render('authenticate', {err:'', isReg:false, loginSuccess:true});
});
app.get('/t', function(req,res){
    res.send(req.session.userID+" "+req.session.userProfile.fullname);
})
app.post('/t/logout', function(req,res){
    req.session.destroy();
    if(req.session && req.session.userID)
    res.send(req.session.userID);
    else res.send('you logged out');
});
// app.post('/login',urlencodedParser, function (req, res) { //NOT as middleWave
app.post('/login', function (req, res) {    
    const user = require('./models/user');
    user.findOne({name: req.body.name}, (e,userFound)=>{
        if(e){
            console.log(e);
            return res.status(500).send();
        }
        if(!userFound){
            // return res.status(404).send('User not found');
            return res.render('authenticate', {err:'', isReg:false, loginSuccess:false});
        }
        const bcrypt = require('bcrypt');
        bcrypt.compare(req.body.password, userFound.password, (e1, rs)=>{
            // await rs;
            if(rs == true){
                // return res.send('Correct pass');
                req.session.userID=userFound._id;
                req.session.userProfile=userFound;
                currentUser=userFound._id;
                
                return res.redirect('/');
                
            }
            // return res.send('Incorrect pass');
            return res.render('authenticate', {err:'', isReg:false, loginSuccess:false});
        })
    });
});
// app.get('/register', function (req, res) {
//     res.render('authenticate', {err:'', isReg:false, loginSuccess:true});
// });
app.post('/register', function (req, res) {
    // io.on('connection', socket => {
        // console.log('socket login ID '+socket.id);
        const user = require('./models/user');
        let mUser = new user();
        mUser.fullname=req.body.fullname;
        mUser.name=req.body.name;
        mUser.password=req.body.password;
        mUser.save((e, rs)=>{
            if(!e)
            //  res.send(rs);
            res.render('authenticate', {err: '', isReg:true, regSuccess:true });
            else{
                console.log(e.message);
                res.render('authenticate', {err: e, isReg:true, regSuccess:false });
            } 
        });
        
        // user.findOne({ name: req.body.name }).exec(function (err, userFound) {
        //     if (err) {
        //         console.log(err)
        //     }
        //     else if (userFound) {
        //         res.render('login');
        //         //res.redirect('/login/#content1');
        //         console.log(userFound._id);
        //     }
        //     else user.create({ fullname: req.body.fullname, name: req.body.name, password: req.body.password });
        // })
    // });

});



