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

					{clients.length > 0 ? (
						<div className={styles.list}>
							{Object.keys(clientMe).length > 0 && clients.map(item => {
								return <ClientItem key={item.id} item={item} clientMe={clientMe} notifications={notifications} />;
							})}
						</div>
					) : <p className={styles.nobody}>Nobody&#39;s here :(</p>}
				</div>
			</div>
		);
	}
}
