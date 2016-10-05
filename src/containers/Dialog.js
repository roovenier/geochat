import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogPage from '../components/DialogPage/DialogPage';
import { addMessage } from '../actions/messages';
import { removeNotification } from '../actions/notifications';
import { getDistance, guidGenerator } from '../helpers';

class Dialog extends Component {
	render() {
		const { clientMe, clientList } = this.props.clients;

		const interlocutor = clientList.filter(item => item.id === this.props.params.clientId)[0] || null;

		return (
			<DialogPage
				interlocutor={interlocutor}
				clientMe={clientMe}
				messages={this.props.messages}
				sendMessage={text => this.sendMessage(text)}
			/>
		);
	}

	shouldComponentUpdate(nextProps) {
		if(JSON.stringify(nextProps.messages) !== JSON.stringify(this.props.messages) || JSON.stringify(nextProps.notifications) !== JSON.stringify(this.props.notifications) || JSON.stringify(nextProps.clients) !== JSON.stringify(this.props.clients)) {
			return true;
		}
		return false;
	}

	componentDidMount() {
		this.removeNotification();
	}

	componentDidUpdate() {
		this.removeNotification();
	}

	removeNotification() {
		this.props.removeNotification(this.props.clients.clientMe.id, this.props.params.clientId);
	}

	sendMessage(text) {
		const { clients, addMessage, socket, params } = this.props;

		const messageObj = {
			sender: clients.clientMe.id,
			id: guidGenerator(),
			date: Math.floor(Date.now() / 1000),
			text
		}
		addMessage(this.props.params.clientId, messageObj);
		socket.emit('adding message', {recipient: params.clientId, sender: clients.clientMe.id, message: messageObj});
		socket.emit('adding notification', {recipient: params.clientId, sender: clients.clientMe.id});
	}
}

const mapStateToProps = ({ messages, clients, notifications, socket }) => ({
	messages,
	clients,
	notifications,
	socket
});

const mapDispatchToProps = dispatch => ({
	removeNotification: (myId, clientId) => dispatch(removeNotification(myId, clientId)),
	addMessage: (clientId, messageObj) => dispatch(addMessage(clientId, messageObj))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
