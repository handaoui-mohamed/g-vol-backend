import jwt from 'jsonwebtoken';
import io from '../../config/socket';
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
					socket.accountId = account._id;
			});
		else
			socket.disconnect();
	}
}

function getAccountSocket(accountId) {
	if (io.sockets.connected) {
		return io.sockets.connected.find(socket => socket.accountId === accountId);
	}
}

function disconnectAccount(accountId) {
	const socket = getAccountSocket(accountId);
	if (socket) socket.disconnect();
}

function removeAccountfromRoom(accountId, room) {
	const socket = getAccountSocket(accountId);
	if (socket) socket.leave(room);
}

function removeAccountAndDisconnect(accountId, room) {
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
	removeAccountfromRoom,
	removeAccountAndDisconnect
}