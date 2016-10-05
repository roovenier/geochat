import React from 'react';
import styles from './styles.styl';

const DialogMsg = ({ item, client, date }) => {
	return (
		<div className={styles.item}>
			<div className={styles.avatar} style={{backgroundColor: client.colors.hex}}></div>

			<div className={styles.message}>
				<p className={styles.date}>{date.getHours()}:{date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}</p>

				<p className={styles.text}>{item.text}</p>
			</div>
		</div>
	);
};

export default DialogMsg;
