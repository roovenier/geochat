import React, { Component } from 'react';
import styles from './styles.styl';

export default class Loading extends Component {
	render() {
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
}
