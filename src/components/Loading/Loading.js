import React from 'react';
import styles from './styles.styl';

const Loading = () => {
	return (
		<div className={styles.container}>
			<p className={styles.text}>Loading</p>

			<span className={styles.dots}>
				<span>.</span>
				<span>.</span>
				<span>.</span>
			</span>
		</div>
	);
}

export default Loading;
