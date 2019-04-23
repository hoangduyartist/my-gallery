const express = require('express');
const app = express();
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
//var io1 = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

//store
// {name:'admin', avaLink:'abc'}
let usrArray=[];

//connect to server
io.on("connection",(socket)=>{
    //server send socketID back to client who connected
    //socket.emit("S-send-socketID",socket.id);
    console.log("client "+socket.id+" connected.");
    //disconnect
    socket.on("disconnect",()=>{
        console.log("client "+socket.id+" disconnected.");
    });
    socket.on("C-register", data =>{
        
        let regStatus = true;
        usrArray.forEach((item,key)=>{
            if(item.name===data.name){
                //register failed
                socket.emit('C-register-failed');
                regStatus=false;
            }
        })
        if(regStatus){
            // register success
            socket.emit('C-register-success',data);
            usrArray.push(data);
            //server send data back to all clients
            io.sockets.emit("S-send-contact-all",usrArray);
        }
        
    })
    socket.on('C-send-mes',data =>{
        // server send data back to current client (only you)
        socket.emit("S-send-mes-cur-C",data);
        //server send data back to other clients except you
        socket.broadcast.emit("S-send-mes-all",data);
    })

});


app.get('/inc',function(req,res){
    res.render('chatInc');
});