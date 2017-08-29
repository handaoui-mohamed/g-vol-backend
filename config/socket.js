import socketio from 'socket.io';
import app from './express';
import http from 'http';

const server = require('http').Server(app);

const io = socketio(server);

export default { io, server };
