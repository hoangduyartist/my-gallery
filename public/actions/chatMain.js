
$(window).ready(function(){
    let socket = io("http://localhost:3000/");
//let socket = io("https://duynh-my-chat.herokuapp.com/");
    socket.on('load-contacts', data=>{
        
        console.log(data);
    });
});