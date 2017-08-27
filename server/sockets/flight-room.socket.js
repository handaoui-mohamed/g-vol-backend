import initRoomMessages from './messages.socket';
export default function (io, socket) {
    socket.on('flightid', (flight) => {
        socket.join(flight);
        initRoomMessages(io, socket, flight);
        console.log("JOINED FLIGHT", flight);
        io.in(flight).emit('message', 'MSG : CONNECTED');
    });
}              