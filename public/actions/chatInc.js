
//let socket = io("http://localhost:3000" || "https://duynh-my-chat.herokuapp.com/");
let socket = io("https://duynh-my-chat.herokuapp.com/");
let usr = {}

socket.on('C-register-failed',()=>{
    alert('This user name is already used.');
});
socket.on('C-register-success',data=>{
    $("#register-frame").hide(1000);
    $("#frame").show(800);
    usr=data;
    $('#frame #profile #profile-img').attr('src',data.avaLink);
    $('#frame #profile #profile-img').next().text(data.name);
    $('#frame .messages .sent img').attr('src',data.avaLink)
});
socket.on("S-send-contact-all", data=>{
    $('#contacts ul').html('');
    data.forEach((item,key)=>{
        $(`
            <li class="contact">
				<div class="wrap">
					<span class="contact-status online"></span>
					<img src=${item.avaLink} alt="" />
					<div class="meta">
						<p class="name">${item.name}</p>
						<p class="preview">You just got LITT up, Mike.</p>
					</div>
				</div>
			</li>
        `).appendTo($('#contacts ul'));
    });
});
socket.on("S-send-mes-cur-C", data =>{
    $(`<li class="sent"><img src=${data.usrData.avaLink} alt="" /><p>` + data.message + '</p></li>').appendTo($('.messages ul'));
});
socket.on("S-send-mes-all", data =>{
    $(`<li class="replies"><img src=${data.usrData.avaLink} alt="" /><p>` + data.message + '</p></li>').appendTo($('.messages ul'));
});
//receive socket ID when connect
//socket.on("S-send-socketID", skID => { $(`h1`).text("Hello " + skID) });
$(document).ready(function () {
    //register first
    $("#register-frame").show(1000);
    $("#frame").hide();
    
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");

    $("#profile-img").click(function () {
        $("#status-options").toggleClass("active");
    });

    $(".expand-button").click(function () {
        //$("#profile").toggleClass("expanded");
        // $("#contacts").toggleClass("expanded");
    });

    $("#status-options ul li").click(function () {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");

        if ($("#status-online").hasClass("active")) {
            $("#profile-img").addClass("online");
        } else if ($("#status-away").hasClass("active")) {
            $("#profile-img").addClass("away");
        } else if ($("#status-busy").hasClass("active")) {
            $("#profile-img").addClass("busy");
        } else if ($("#status-offline").hasClass("active")) {
            $("#profile-img").addClass("offline");
        } else {
            $("#profile-img").removeClass();
        };

        $("#status-options").removeClass("active");
    });

    function newMessage() {
        message = $(".message-input input").val();
        if ($.trim(message) == '') {
            return false;
        }
        //$(`<li class="sent"><img src=${usr.avaLink} alt="" /><p>` + message + '</p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $('.contact.active .preview').html('<span>You: </span>' + message);
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
        
        let usrAndMes = {usrData : usr, message: message}
        socket.emit("C-send-mes",usrAndMes);
    };

    $('.submit').click(function () {
        newMessage();
    });

    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            newMessage();
            return false;
        }
    });

    /////tranfer action with socket.io////
    $('#regBtn').click(()=>{
        let name = $('#register-frame #usr').val();
        if ($.trim(name) == '') {
            alert('Input your name !');
            return false;
        }
        let usrData = {
            name : name,
            avaLink : $('#register-frame #slt option:selected').val()
        }
        socket.emit("C-register",usrData);
    });
});