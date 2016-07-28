import React, { Component } from 'react';
import { getDistance } from '../../helpers';
import common from '../common.styl';
import styles from './styles.styl';
import ClientItem from '../ClientItem/ClientItem';

export default class ClientsList extends Component {
	render() {
		const { clients, clientMe, notifications } = this.props;

		return (
			<div className={common.container}>
				<div className={styles.clients}>
					<p className={styles.title}>Current users near you:</p>

					<div className={styles.list}>
						{Object.keys(clientMe).length > 0 && clients.map(item => {
							if(item.coords && item.colors) {
								const distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, item.coords.latitude, item.coords.longitude);
								return (distance !== 0 && distance < 10 && clients.id !== clientMe.id) ? <ClientItem key={item.id} item={item} clientMe={clientMe} notifications={notifications} distance={distance} /> : null;
							}
						})}
					</div>
				</div>
			</div>
		);
	}
}
