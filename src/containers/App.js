import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Promise } from 'es6-promise';
import 'normalize.css';

import csscolors from 'json!../colors.json';
import { getCoords, pickRandomProperty, capitalizeFirstLetter } from '../helpers';
import { setClientMe, setClients } from '../actions/clients';
import { addMessage } from '../actions/messages';
import { addNotification } from '../actions/notifications';
import { setSocket } from '../actions/socket';

import styles from '../components/common.styl';
import Header from '../components/Header/Header';
import Profile from '../components/Profile/Profile';
import Loading from '../components/Loading/Loading';

class App extends Component {
	constructor(props) {
		super(props);
		const { setSocket, setClientMe, setClients, addMessage, addNotification } = this.props;

		this.socket = io();
		setSocket(this.socket);

		this.socket.on('set my client data', data => setClientMe(data));

		this.socket.on('get clients', () => this.socket.emit('getting clients'));

		this.socket.on('setting clients', clients => setClients(clients));

		this.socket.on('getting message', obj => addMessage(obj.sender, obj.message));

		this.socket.on('getting notification', obj => addNotification(obj.recipient, obj.sender));

		Promise.all([
			new Promise((resolve, reject) => {
				const colorName = pickRandomProperty(csscolors);
				const colorHex = csscolors[colorName];
				resolve({colorName: capitalizeFirstLetter(colorName), colorHex});
			})
		, getCoords])
			.then(values => {
				this.socket.emit('setting client metadata', {colors: values[0], coords: values[1]});
			})
			.catch(error => {
				const e = error.message || error;
				alert(e);
			});
	}

	render() {
		const { clientMe } = this.props.clients;

		if(clientMe.coords && clientMe.colors && Object.keys(this.props.socket).length !== 0) {
			return (
				<div className={styles.wrapper}>
					<Header />

					<Profile
						clientMe={clientMe}
						profileDialog={this.props.location.pathname.indexOf('dialog/') === -1 ? false : true}
					/>

					{this.props.children}
				</div>
			);
		} else {
			return <Loading />;
		}
	}
}

const mapStateToProps = ({ clients, socket }) => ({
	clients,
	socket
});

const mapDispatchToProps = dispatch => ({
	setSocket: socket => dispatch(setSocket(socket)),
	setClientMe: data => dispatch(setClientMe(data)),
	setClients: clients => dispatch(setClients(clients)),
	addMessage: (sender, message) => dispatch(addMessage(sender, message)),
	addNotification: (recipient, sender) => dispatch(addNotification(recipient, sender))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
