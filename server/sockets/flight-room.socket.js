import initRoomMessages from './messages.socket';
import Flight from '../models/flight.model';

export default function (io, socket) {
    socket.on('flightId', (flightId) => {
        Flight.findOne({ _id: flightId }).then(function (flight) {
            if (flight) {
                socket.join(flightId);
                initRoomMessages(io, socket, flightId);
                io.in(flightId).emit('joined', flightId);
            }
        }).catch(e => console.log('join flight does not exist !', e));
    });
}              