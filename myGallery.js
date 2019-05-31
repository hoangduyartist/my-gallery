// package.json // "test": "echo \"Error: no test specified\" && exit 1"
//basic depens
const express = require('express');
const app = express();
const server = require("http").Server(app);
//basic depens
const io = require("socket.io")(server); //socket.io
var mongoose = require("mongoose"); //mongoDB DOM
const bodyParser = require("body-parser");
var session = require("express-session");
const path = require("path");
const engine = require("ejs-locals");

const galleryRouters = require('./routers/myGalleryRouter');

//global store

//end global store
app.use(express.static("public")); //auto access /public in client
app.engine("ejs",engine);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "secretSessionTest", resave: false, saveUninitialized: true }));
// check login middleware
// ....
app.use(galleryRouters);

let PORT = process.env.PORT || 3000;
server.listen(PORT);

// let urlMongo = "mongodb://localhost:27017/node_chat";
let urlMongo = process.env.MONGODB_URI || "mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/test?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    (rs) => {
        console.log('connect DataBase MongGo OK');
    }
)
    .catch(connectError => connectError);


app.get('/testUI', (req,res)=>{
    res.render('components/cards/interCard');
})

app.get('/usr',(req,res)=>{
    let user = require('./models/user');
    user.find({})
    .then(usr=>res.send(usr))
    .catch()
})
