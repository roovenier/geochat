import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogPage from '../components/DialogPage/DialogPage';
import { addMessage } from '../actions/messages';
import { removeNotification } from '../actions/notifications';
import { getDistance, guidGenerator } from '../helpers';

const ioObject = io();

class Dialog extends Component {
	constructor(props) {
		super(props);
		this.socket = ioObject;
	}

	render() {
		const { clientMe, clients } = this.props.clients;

		const interlocutor = clients.filter(item => item.id === this.props.params.clientId)[0];
		const distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, interlocutor.coords.latitude, interlocutor.coords.longitude);

		return (
			<DialogPage
				interlocutor={interlocutor}
				clientMe={clientMe}
				distance={distance}
				messages={this.props.messages}
				sendMessage={text => this.sendMessage(text)}
			/>
		);
	}

	shouldComponentUpdate(nextProps) {
		if(JSON.stringify(nextProps.messages) !== JSON.stringify(this.props.messages) || JSON.stringify(nextProps.notifications) !== JSON.stringify(this.props.notifications)) {
			return true;
		}
		return false;
	}

	componentDidMount() {
		this.props.dispatch(removeNotification(this.props.clients.clientMe.id, this.props.params.clientId));
	}

	componentDidUpdate() {
		this.props.dispatch(removeNotification(this.props.clients.clientMe.id, this.props.params.clientId));
	}

	sendMessage(text) {
		const messageObj = {
			sender: this.props.clients.clientMe.id,
			id: guidGenerator(),
			date: Math.floor(Date.now() / 1000),
			text
		}
		this.props.dispatch(addMessage(this.props.params.clientId, messageObj));
		this.socket.emit('adding message', {recipient: this.props.params.clientId, sender: this.props.clients.clientMe.id, message: messageObj});
		this.socket.emit('adding notification', {recipient: this.props.params.clientId, sender: this.props.clients.clientMe.id});
	}
}

function select(state) {
	return {
		messages: state.messages,
		clients: state.clients,
		notifications: state.notifications
	};
}

export default connect(select)(Dialog);
