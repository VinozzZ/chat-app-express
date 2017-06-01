var socketio = require('socket.io');
var io = socketio();
var socketApi = {};

socketApi.io = io;

io.on('connection', (socket)=>{
	console.log('A user connected');
})

module.exports = socketApi;