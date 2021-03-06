import React from 'react';
import { Link } from 'react-router';
import styles from './styles.styl';

const ClientItem = ({ item, clientMe, notifications }) => {
	return (
		<Link className={styles.item} to={`/dialog/${item.id}`}>
			<div className={styles.client}>
				<div className={styles.avatar} style={{backgroundColor: item.colors.hex}}></div>

				<div className={styles.data}>
					<div className={styles.status}>
						<p className={styles.name} style={{color: item.colors.hex}}>Mr. {item.colors.name}</p>

						{notifications[clientMe.id] && notifications[clientMe.id][item.id] ? <span className={styles.notifications}>{notifications[clientMe.id][item.id]}</span> : null}
					</div>

					<p className={styles.distance}>~{Math.round(item.distance * 1000)}m from you</p>
				</div>
			</div>
		</Link>
	);
};

export default ClientItem;
