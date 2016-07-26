import React, { Component } from 'react';
import { connect } from 'react-redux';
import { guidGenerator } from '../helpers';
import { addMessage } from '../actions/messages';
import { removeNotification } from '../actions/notifications';

const ioObject = io();

class Dialog extends Component {
	constructor(props) {
		super(props);
		this.socket = ioObject;
	}

	render() {
		//const dialogObj = this.props.messages.find((d) => JSON.stringify(d.clients) === JSON.stringify([this.props.clients.clientMe.id, this.props.params.clientId])) || {};
		//const dialogObj = this.props.messages.find(item => item.clients.indexOf(this.props.clients.clientMe.id) > -1 && item.clients.indexOf(this.props.params.clientId) > -1) || {};
		//console.log(dialogObj);

		return (
			<div>
				<p>this is dialog page with {this.props.params.clientId}</p>

				{this.props.messages[this.props.params.clientId] && this.props.messages[this.props.params.clientId].map(item => {
					const date = new Date(item.date * 1000);

					return (
						<div key={guidGenerator()}>
							<p><span>{date.getHours()}:{'0' + date.getMinutes()}</span> {item.sender} says:</p>
							<p>{item.text}</p>
							<hr />
						</div>
					);
				})}

				<textarea placeholder="Write something..." ref="msgText"></textarea>

				<br />

				<button onClick={() => this.sendMessage()}>Send</button>
			</div>
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
		//console.log([this.props.clients.clientMe.id, this.props.params.clientId]);
		//console.log(this.props.messages.find((d) => JSON.stringify(d.clients) === JSON.stringify([this.props.clients.clientMe.id, this.props.params.clientId])));
	}

	// componentWillReceiveProps(nextProps) {
	// 	this.socket.emit('messages', {recipient: this.props.params.clientId, client: this.props.clients.clientMe.id, messages: nextProps.messages[this.props.params.clientId]});
	// }

	sendMessage() {
		const messageObj = {
			sender: this.props.clients.clientMe.id,
			date: Math.floor(Date.now() / 1000),
			text: this.refs.msgText.value
		}
		this.props.dispatch(addMessage(this.props.params.clientId, messageObj));
		this.socket.emit('adding message', {recipient: this.props.params.clientId, sender: this.props.clients.clientMe.id, message: messageObj});
		this.socket.emit('adding notification', {recipient: this.props.params.clientId, sender: this.props.clients.clientMe.id});
		this.refs.msgText.value = '';
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
