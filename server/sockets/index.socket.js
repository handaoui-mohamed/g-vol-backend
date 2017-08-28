import jwt from 'jsonwebtoken';
import config from '../../config/config';
import Account from '../models/account.model';

export default function (io) {
    io.sockets.on('connection', (socket) => {
        console.log('connect flights:', socket.handshake.query);
        let token = socket.handshake.query.token;
        if (token) {
            token = token.split(' ')[1];
            let accountJWT;
            try {
                accountJWT = jwt.verify(token, config.jwtSecret);
            } catch (e) {
                socket.disconnect();
            }
            if (accountJWT)
                Account.get(accountJWT.id).then((account) => {
                    if (!account)
                        socket.disconnect();
                    else
                        socket.accountId = account._id;
                });
            else
                socket.disconnect();
        }

        const flightRoom = require('./flight-room.socket')(io, socket);
    });
}