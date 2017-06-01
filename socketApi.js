var socketio = require('socket.io');
var io = socketio();
var socketApi = {};
var chatHistory = [];
var userArray = [];
socketApi.io = io;

io.on('connection', (socket)=>{
	io.sockets.on('connect', (socket)=>{
    io.sockets.emit('chatHistory', chatHistory);
    socket.on('disconnect', ()=>{
        var index = userArray.indexOf(socket.userName);
        if (index > -1){
            userArray.splice(index, 1);
        }
        io.sockets.emit('updateUserListToServer', userArray);
    })
    io.sockets.emit('userListToServer', userArray);
    socket.on('newNameToServer', (newUser)=>{
    	console.log(newUser);
        // console.log(name + " just joined.");
        if (userArray.indexOf(newUser) <= -1){
            userArray.push(newUser);
            socket.userName = newUser;
            io.sockets.emit('newUser', newUser);
        }else {
            var extistingUserHTML = "You already entered the room"
            io.sockets.emit('existingUser', extistingUserHTML);
        }
    });
    socket.on('newMsgToServer', (msgObj)=>{
        if(chatHistory.length > 10){
            chatHistory.shift();
        }else {
            chatHistory.push(msgObj.currentUserName + " says " + msgObj.newMsg);
        }
        io.sockets.emit('newMessage', msgObj.currentUserName + " says " + msgObj.newMsg);
    })

});

});

module.exports = socketApi;