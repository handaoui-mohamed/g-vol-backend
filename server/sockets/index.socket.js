import socketHandler from '../handlers/socket.handler';

export default function (io) {
    io.sockets.on('connection', (socket) => {
        console.log('connectd flights');
        socketHandler.handshake(socket);

        const flightRoom = require('./flight-room.socket')(io, socket);
    });
}