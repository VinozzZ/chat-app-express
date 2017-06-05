 $(document).ready(function(){
	var socketio = io.connect('http://localhost:3000');
    var msgHTML = '';
    var currentUserName = '';
    var usersDiv = $('.users');
    var updateMsgDiv = $('.update');
    var messageDiv = $(".display-msg");

    socketio.on('currentUserList', (list)=>{
        for (let name of list){
            usersDiv.append(`<p>${name}</p>`);
        }
    });
    socketio.on('updateUserListToServer', (list)=>{
        usersDiv.html("");
        for (let name of list){
            usersDiv.append(`<p>${name}</p>`);
        }
    });
    $('#submit-name').submit(function(e){
        e.preventDefault();
        currentUserName = $('#name').val();
        if (currentUserName != ""){
            socketio.emit('join', currentUserName);
            $("#message").focus();
        }else {
            updateMsgDiv.html('<strong>You need to enter a name.</strong>')
            setTimeout(()=>{
                updateMsgDiv.html("");
            }, 2000);
        }
        $('form')[0].reset();
    });


    socketio.on('name', (name)=>{
        usersDiv.append(`<p>${name}</p>`);
    });
    socketio.on('chatHistory', (chat)=>{
        for (let msg of chat){
            messageDiv.append(`<p>${msg}</p>`);
        }
    });
    socketio.on('update', (update)=>{
        updateMsgDiv.html(`<strong>${update}</strong>`);
        setTimeout(()=>{
            updateMsgDiv.html("");
        }, 2000);
    });


    $('#submit-message').submit((e)=>{
        e.preventDefault();
        var newMsg  = $('#message').val();
        socketio.emit('send', newMsg);
        $('form')[1].reset();
    });

    socketio.on('newMsg', (msg)=>{
        messageDiv.append(`<p>${msg}</p>`);
    });

    socketio.on('mention', (bool)=>{
        console.log(bool);
        if(bool){
            messageDiv.css("color", "red");
        }
    })

    // 'is typing message'
    var typing = false;
    var timeout = 0;

    function timeoutFunction(){
        typing = false;
        socketio.emit("typing", false);
    }
    $("#message").keypress((e)=>{
        if(e.which !== 13){
        	if(typing === false && $('#message').is(":focus")){
                typing = true;
                socketio.emit("typing", true);
            }else {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFunction, 5000);
            }
        }
    });
    socketio.on('typing', (msg)=>{
        $('.feedback').html(`<p>${msg}</p>`);
        setTimeout(()=>{
            $('.feedback').html("");
        }, 2000);
    })
});
