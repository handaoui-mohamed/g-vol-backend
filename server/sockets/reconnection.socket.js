
import Flight from '../models/flight.model';
import Account from '../models/account.model';

export default function (io, socket) {
	socket.removeListener('socket-reconnected', (data) => { });
	socket.on('socket-reconnected', (data) => {
		// data should contain array of flight ids
		let flightIds = JSON.parse(data);

		Flight
			.find({ _id: { $in: flightIds } })
			.select({ messages: 0 }) // for messages must be loaded separately to reduce response size
			.then((flts) => {
				if (flts.length > 0) {
					let promises = [];
					let flights = [];
					flts.forEach((flight) => {
						if (flight.team.length > 0) {
							promises.push(Account.find({ _id: { $in: flight.team } }).then((team) => {
								let flt = flight.toJSON();
								flt.team = team;
								flights.push(flt);
							}));
						}
					});

					Promise.all(promises).then(() => {
						socket.emit('reconnected', JSON.stringify(flights));
					})
				}
			});
	});
}   