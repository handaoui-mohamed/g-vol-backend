import initRoomMessages from './messages.socket';
import Flight from '../models/flight.model';
import socketHandel from '../handlers/socket.handler';

export default function (io, socket) {
    socket.on('flightId', (flightId) => {
        Flight.findOne({ _id: flightId, team: { $in: [socket.accountId] } }).then(function (flight) {
            if (flight) {
                console.log('User :' + socket.account.username + " :" + socketHandel.isInFlight(socket, flightId));
                if (!socketHandel.isInFlight(socket, flightId)) {
                    socket.join(flightId);
                    initRoomMessages(io, socket, flightId);
                    console.log("Joined in server");
                    io.in(flightId).emit('joined', JSON.stringify({ flightId, account: socket.account }));
                }
            } else
                socket.emit('unauthorized join', flightId);

        }).catch(e => console.log('join flight does not exist !', e));
    });
}