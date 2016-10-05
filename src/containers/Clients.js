import React from 'react';
import { connect } from 'react-redux';

import ClientsList from '../components/ClientsList/ClientsList';

const Clients = ({ notifications, clients }) => {
	const { clientList, clientMe } = clients;

	return (
		<ClientsList
			clients={clientList}
			clientMe={clientMe}
			notifications={notifications}
		/>
	);
};

const mapStateToProps = ({ clients, notifications }) => ({
	clients,
	notifications
});

export default connect(mapStateToProps)(Clients);
