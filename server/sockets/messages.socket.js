export default function (io, socket, flightid) {
    console.log("HEY!",flightid);
    socket.on('messages/' + flightid, (data) => {
        // SAVE MESSAGE 
        console.log("MESSAGE RECEIVED");
        io.in(flightid).emit('messages/' + flightid, data);
    });
}