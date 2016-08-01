import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'normalize.css';

import csscolors from 'json!../colors.json';
import { getCoords, getDistance, pickRandomProperty, capitalizeFirstLetter } from '../helpers';
import { setDefaultClients } from '../actions/clients';
import { addMessage } from '../actions/messages';
import { addNotification } from '../actions/notifications';

import styles from '../components/common.styl';
import Header from '../components/Header/Header';
import Profile from '../components/Profile/Profile';

class App extends Component {
	constructor(props) {
		super(props);
		this.socket = io();

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

		const colorName = pickRandomProperty(csscolors);
		const colorHex = csscolors[colorName];
		this.socket.emit('setting client metadata', {
			colorName: capitalizeFirstLetter(colorName), colorHex
		});

		getCoords
			.then(result => {
				this.socket.emit('setting geoCoords', result);
			})
			.catch(error => {
				alert(error);
			});
	}

	render() {
		const { clientMe } = this.props.clients;

		if(clientMe.coords && clientMe.colors) {
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
			return null;
		}
	}
}

function select(state) {
	return {
		clients: state.clients
	};
}

export default connect(select)(App);
