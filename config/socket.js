import socketio from 'socket.io';
import app from './express';
import http from 'http';

var server = require('http').Server(app);

var io = socketio(server);

export default { io, server };
