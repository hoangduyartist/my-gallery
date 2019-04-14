

/*var app = express();
app.listen(8080);*/
const express = require('express');
const app = express();
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

//connect to server
io.on("connection",(socket)=>{
    //server send socketID back to client who connected
    socket.emit("S-send-socketID",socket.id);

    console.log("client "+socket.id+" connected.");

    //disconnect
    socket.on("disconnect",()=>{
        console.log("client "+socket.id+" disconnected.");
    });

    //receive data
    socket.on("C-send-data",(data)=>{
        console.log("client "+socket.id+" sent: "+data);

        //server send data back to all clients
        //io.sockets.emit("S-send-data-all",data+" (server send to all)");
        
        //server send data back to current client (only you)
        //socket.emit("S-send-data-all",data+" (server send to you)");

        //server send data back to other clients except you
        //socket.broadcast.emit("S-send-data-all",data+" (server send all except client who sent)");

        //io.to("socketID").emit()
    });
});


app.get('/',function(req,res){
    res.render('testchat');
});
/*const port = 8080
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/