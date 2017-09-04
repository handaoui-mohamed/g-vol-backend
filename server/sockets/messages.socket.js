import joi from 'joi'
import messageCtrl from '../controllers/message.controller';
import paramValidation from '../validators/message.validator';
import Flight from '../models/flight.model';
export default function (io, socket, flightId) {
    socket.removeListener('new-message/' + flightId, (data) => { });
    socket.on('new-message/' + flightId, (data) => {
        data = JSON.parse(data);
        joi.validate(data, paramValidation.createMessage, (err) => {
            if (!err) {
                data.body.accountId = socket.accountId;
                Flight.findByIdAndUpdate(data.params.flightId, { $push: { messages: { $each: [data.body], $position: 0 } } },
                    { "new": true }, (err, flight) => {
                        if (err) console.warn('save : ', err);
                        io.in(data.params.flightId).emit('messages/' + data.params.flightId, JSON.stringify({
                            message: flight.messages[0],
                            flightId: data.params.flightId
                        }));
                    });
            }
            else console.log('Message create validation', err);
        });
    });
}