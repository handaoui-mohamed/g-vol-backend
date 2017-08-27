import socketio from 'socket.io';
import app from './express';
import http from 'http';

var server = require('http').Server(app);

var io = socketio.listen(server);

io.on('connection', (socket) => {
    console.log('connect flights');
    socket.on('flightid', (flight) => {
        console.log("JOINED FLIGHT", flight);
        socket.join(flight);
        // socket.in(flight).emit('message','MSG : CONNECTED'); 
    });
});

export default { io, server };
