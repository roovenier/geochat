import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, RouterContext, Link } from 'react-router';
import { getCoords, getDistance } from '../helpers';
import { setDefaultClients } from '../actions/clients';
import { addMessage } from '../actions/messages';
import { addNotification } from '../actions/notifications';

const ioObject = io();

class Clients extends Component {
	constructor(props) {
		super(props);
		this.socket = ioObject;
		this.socket.removeAllListeners('getting clients');
		this.socket.removeAllListeners('getting message');
		this.socket.removeAllListeners('getting notification');
	}

	render() {
		const { clients, clientMe } = this.props.clients;
		const { notifications } = this.props;

		return (
			<ul>
				{Object.keys(clientMe).length > 0 && clients.map(item => {
					const distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, item.coords.latitude, item.coords.longitude);
					return (distance !== 0 && distance < 10 && clients.id !== clientMe.id) ? (
						<li key={item.id}>
							<Link to={`/dialog/${item.id}`}>{item.id}, distance: {Math.round(distance * 1000)}m</Link>
							{notifications[clientMe.id] && notifications[clientMe.id][item.id] ? <span>{notifications[clientMe.id][item.id]} сообщения</span> : null}
						</li>
					) : '';
				})}
			</ul>
		);
	}

	componentDidMount() {
		this.socket.on('getting clients', clients => {
			this.props.dispatch(setDefaultClients(
				clients.filter(item => item.id !== this.socket.id),
				clients.filter(item => item.id === this.socket.id)[0])
			);
		});

		this.socket.on('getting message', obj => {
			this.props.dispatch(addMessage(obj.sender, obj.message));
		});

		this.socket.on('getting notification', obj => {
			this.props.dispatch(addNotification(obj.recipient, obj.sender));
		})

		getCoords()
			.then(result => {
				this.socket.emit('setting geoCoords', result);
			})
			.catch(error => {
				alert(error);
			});
	}
}

function select(state) {
	return {
		clients: state.clients,
		notifications: state.notifications
	};
}

export default connect(select)(Clients);
