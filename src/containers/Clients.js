import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDistance } from '../helpers';

import ClientsList from '../components/ClientsList/ClientsList';

class Clients extends Component {
	render() {
		const { clients, clientMe } = this.props.clients;
		const { notifications } = this.props;

		const filteredClients = clients.filter(item => {
			if(clientMe.coords && clientMe.colors && item.coords && item.colors) {
				let distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, item.coords.latitude, item.coords.longitude);
				item.distance = distance;
				return distance !== 0 && distance < 10 && (item.id !== clientMe.id);
			} else {
				return false;
			}
		});

		return (
			<ClientsList
				clients={filteredClients}
				clientMe={clientMe}
				notifications={notifications}
			/>
		);
	}
}

function select(state) {
	return {
		clients: state.clients,
		notifications: state.notifications
	};
}

export default connect(select)(Clients);
