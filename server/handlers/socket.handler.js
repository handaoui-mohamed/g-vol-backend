import jwt from 'jsonwebtoken';
import config from '../../config/config';
import socketConfig from '../../config/socket';
import Account from '../models/account.model';

function handshake(socket) {
	let token = socket.handshake.query.token;
	if (token) {
		token = token.split(' ')[1];
		let accountJWT;
		try {
			accountJWT = jwt.verify(token, config.jwtSecret);
		} catch (e) {
			socket.emit('unauthorized');
			socket.disconnect();
		}
		if (accountJWT)
			Account.get(accountJWT.id).then((account) => {
				if (!account) {
					socket.emit('unauthorized');
					socket.disconnect();
				}
				else {
					socket.accountId = account._id.toString();
					socket.account = account;
					socket.emit('connected', account);
				}
			});
		else {
			socket.emit('unauthorized');
			socket.disconnect();
		}
	}
}

function getAccountSocket(accountId) {
	let io = socketConfig.io;
	if (io.sockets.connected) {
		for (let socketId in io.sockets.connected) {
			if (io.sockets.connected.hasOwnProperty(socketId)) {
				let socket = io.sockets.connected[socketId];
				if (socket.accountId === accountId)
					return socket;
			}
		}
	}
}

function disconnectAccount(accountId) {
	const socket = getAccountSocket(accountId);
	if (socket) socket.disconnect();
}

function removeAccountfromFlight(accountId, flightId) {
	let io = socketConfig.io;
	const socket = getAccountSocket(accountId);
	if (socket) {
		socket.leave(flightId);
		io.in(flightId).emit('unjoined', JSON.stringify({ flightId }));
	}
}

function isInFlight(socket, flightId) {
	let io = socketConfig.io;
	return io.sockets.adapter.sids[socket.id][flightId]
}


export default {
	handshake,
	isInFlight,
	getAccountSocket,
	disconnectAccount,
	removeAccountfromFlight
}