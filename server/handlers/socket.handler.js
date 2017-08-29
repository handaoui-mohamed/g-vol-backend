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
			socket.disconnect();
		}
		if (accountJWT)
			Account.get(accountJWT.id).then((account) => {
				if (!account)
					socket.disconnect();
				else
					socket.accountId = account._id.toString();
			});
		else
			socket.disconnect();
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
	const socket = getAccountSocket(accountId);
	if (socket) socket.leave(flightId);
}

function removeAccountAndDisconnect(accountId, flightId) {
	const socket = getAccountSocket(accountId);
	if (socket) {
		socket.leave(room);
		socket.disconnect();
	}
}


export default {
	handshake,
	getAccountSocket,
	disconnectAccount,
	removeAccountfromFlight,
	removeAccountAndDisconnect
}