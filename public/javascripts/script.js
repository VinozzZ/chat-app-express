 $(document).ready(function(){
	 var socketio = io.connect('http://localhost:3000');
    var msgHTML = '';
    var currentUserName = '';
    var usersDiv = $('#users');
    var messageDiv = $(".message-box");
    var typing = false;
    var timeout = 0;
    socketio.on('chatHistory', (chat)=>{
        for (let i = 0; i < chat.length; i++){
            messageDiv.append(`<p>${chat[i]}</p>`);
        }
    })
    socketio.on('userListToServer', (nameList)=>{
        for (let i = 0; i < nameList.length; i++){
            usersDiv.append(`<p>${nameList[i]}</p>`);
        }
    });
    $('#submit-name').submit(function(e){
        e.preventDefault();
        currentUserName = $('#name').val();
        socketio.emit('newNameToServer', currentUserName);
    });
    socketio.on('newUser', (userName)=>{
        usersDiv.append(`<p>${userName}</p>`);
    });
    socketio.on('existingUser', (errorMsg)=>{
        usersDiv.append(`<p>${errorMsg}</p>`);
    });
    socketio.on('updateUserListToServer', (nameList)=>{
        usersDiv.empty();
        for (let i = 0; i < nameList.length; i++){
            usersDiv.append(`<p>${nameList[i]}</p>`);
        }
    });
    // console.log(io);

    $('#submit-message').submit((e)=>{
        e.preventDefault();
        var newMsg  = $('#message').val();
        socketio.emit('newMsgToServer', {
            newMsg: newMsg,
            currentUserName: currentUserName
        });
    });
    socketio.on('newMessage', (newMsgB)=>{
        console.log(newMsgB);
        messageDiv.append(`<p>${newMsgB}</p>`);
    });
    function timeoutFunction(){
        typing = false;
        socketio.emit("typing", false);
    }
    $("#message").keypress((e)=>{
        if(e.which !== 13){

        }
    });
});
