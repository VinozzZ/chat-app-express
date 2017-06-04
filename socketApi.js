var socketio = require('socket.io');
var io = socketio();
var socketApi = {};
socketApi.io = io;
var chatHistory = [];
var userArray = {};
var rooms = {};
var clients = [];

function limitedChatHistory(chatHistory){
    if (chatHistory.length > 10){
        chatHistory.shift();
    }
}

io.on('connect', (client)=>{
    limitedChatHistory(chatHistory);
    client.emit('currentUserList', clients);
    client.on('join', (name)=>{
        if(userArray[client.id] == undefined){
            if (clients.indexOf(name) <= -1){
                userArray[client.id] = {'name': name};
                io.emit('name', userArray[client.id].name);
                client.emit('chatHistory', chatHistory);
                clients.push(userArray[client.id].name);
            }
        }else {
            io.emit('update', `${userArray[client.id].name} have already joined the room`);
        }
    });
    client.on('send', (data)=>{
        if (data.length > 0){
            if (userArray[client.id] !== undefined){
                chatHistory.push(`${userArray[client.id].name} says ${data}.`);
                io.emit('newMsg', `${userArray[client.id].name} says ${data}.`);
            }else {
                client.emit('update', "Please enter your name first.");
            }
        }else {
            client.emit('update', "Please at least enter one word first.");
        }
 
    });

    client.on('typing', (data)=>{
        if (data){
            io.emit('typing', `${userArray[client.id].name} is typing a message...`);
        }
    });
});
    // io.emit('chatHistory', chatHistory);
    // client.on('disconnect', ()=>{
    //     if (userArray[client.id]){
    //         if(userArray[client.id].inroom === null){
    //             io.emit("update", `${userArray[client.id].name} is not in a room yet`)
    //         }
    //     }
    // //     var index = userArray.indexOf(client.userName);
    // //     if (index > -1){
    // //         userArray.splice(index, 1);
    // //     }
    // //     io.emit('updateUserListToServer', userArray);
    // })
    // io.emit('userListToServer', userArray);

    // // join function
    // client.on('join', (name)=>{
    //     roomID = null;
    //     if (userArray.indexOf(name) <= -1){
    //         userArray[client.id] = {"name": name, "room": roomID, "owns": null};
    //         client.userName = name;
    //         io.emit('name', name);
    //         client.emit("roomList", {rooms: rooms});
    //         clients.push(client);
    //     }else {
    //         io.emit('update', "You already entered the room");
    //     }
    // });

    // // Send messages
    // client.on('send', (msgObj)=>{
    //     if (io.manager.roomClients[client.id]['/'+client.room] !== undefined){
    //         io.in(client.room).emit('newMessage', msgObj.currentUserName + " says " + msgObj.newMsg)
    //     }else {
    //         client.emit("update", "Please connect to a room.");
    //     }
    //     // if(chatHistory.length > 10){
    //     //     chatHistory.shift();
    //     // }else {
    //     //     chatHistory.push(msgObj.currentUserName + " says " + msgObj.newMsg);
    //     // }
    // });

    // // Room function
    // client.on('createRoom', (name)=>{
    //     if(userArray[client.id].room === null){
    //         var id = uuid.v4();
    //         var room = new Room(name, id, client.id);
    //         rooms[id] = room;
    //         io.emit("roomList", {rooms: room});
    //         client.room = name;
    //         client.join(client.room);
    //         room.addPerson(client.id);
    //         userArray[client.id].room = id; 
    //     }else {
    //         io.emit("update", "You already entered the room");
    //     }
    // });

    // client.on("joinRoom", (id)=>{
    //     var room = rooms[id];
    //     if(client.id === room.owner){
    //         client.emit("update", "You are the owner of the room");
    //     }else {
    //         room.userArray.contains(client.id, (found)=>{
    //             if(found){
    //                 client.emit("update", "You have already joined the room.");
    //             }else {
    //                 if(userArray[client,id].inroom !== null){
    //                     client.emit("update", "You are already in a room");
    //                 }else {
    //                     room.addPerson(client.id);
    //                     userArray[client.id].inroom = id;
    //                     client.room = room.name;
    //                     client.jion(client.room);
    //                     user = userArray[client.id];
    //                     // Sets a modifier for a subsequent event emission that the event will only be broadcasted to clients that have joined the given room.
    //                     io.in(client.room).emit("update", `${user.name} has connected to + room.name`);
    //                     client.emit("update", `Welcome to ${room.name}`);
    //                     client.emit("sendRoomID", {id: id});
    //                 }
    //             }
    //         });
    //     }
    // });

    // client.on("leaveRoom", (id)=>{
    //     var room = rooms[id];
    //     if(client.id === room.owner){
    //         for(let n = 0; n < clients.length; i++) {
    //             if(clients[n].id == room.userArray[n]){
    //                 userArray[clients[n].id].inroom = null;
    //                 // Removes the client from room, and fires optionally a callback with err signature (if any).
    //                 clients[i].leave(room.name);
    //             }
    //         }
    //         delete rooms[id];
    //         userArray[room.owner].owns = null;
    //         io.emit("roomList", {rooms: rooms});
    //         io.in(client.room).emit("update", `The owner ${client.name} has left the room`);
    //     }else {
    //         room.userArray.contains(client.id, (found)=>{
    //             if(found){
    //                 var personIndex = room.userArray.indexOf(client.id);
    //                 room.userArray.splice(personIndex, 1);
    //                 io.emit("update", `userArray[client.id].name has left the room`);
    //                 client.leave(room.name);
    //             }
    //         })
    //     }
    // });

    // client.on("removeRoom", (id)=>{
    //     var room = rooms[id];
    //     if(room){
    //         if(client.id == room.owner){
    //             var sizeofRoom = room.userArray.length;
    //             if(sizeofRoom >= 2){
    //                 client.emit("update", "There are still people in this room");
    //             }else {
    //                 io.in(client.room).emit("update", `The owner ${userArray[client.id].name} has removed the room`);
    //                 for (let n = 0; n < clients.length; n++){
    //                     if(clients[n].id === room.userArray[n]){
    //                         userArray[clients[n].id].inroom = null;
    //                         clients[n].leave(room.name);
    //                     }
    //                 }
    //                 delete rooms[id];
    //                 userArray[room.owner].owns = null;
    //                 io.emit("roomList", {rooms: rooms});
    //             }
    //         }else {
    //             client.emit("update", "Only owner can remove the room.");
    //         }
    //     }
    // });
// });

module.exports = socketApi;