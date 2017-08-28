import joi from 'joi'
import messageCtrl from '../controllers/message.controller';
import paramValidation from '../validators/message.validator';
import Flight from '../models/flight.model';
export default function (io, socket, flightId) {
    socket.on('messages/' + flightId, (data) => {
        joi.validate(data, paramValidation.createMessage, (err) => {
            if (!err) {
                Flight.get(data.params.flightId).then((flight) => {
                    data.body.accountId = socket.accountId;
                    flight.messages.unshift(data.body);
                    flight.save()
                        .then(savedFlight => {
                            io.in(flightId).emit('messages/' + data.params.flightId, savedFlight.messages[0]);
                        }).catch(e => console.warn('save : ', e));
                }).catch(e => console.warn('fetch : ', e));
            }
            else console.log('Message create validation', err);

        });

    });
}