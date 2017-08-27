export default function (io) {
    io.sockets.on('connection', (socket) => {
        console.log('connect flights');
        const flightRoom = require('./flight-room.socket')(io, socket);
    });
}