import React, { Component } from 'react';
import common from '../common.styl';
import styles from './styles.styl';

export default class Header extends Component {
	render() {
		const { clientMe } = this.props;

		return (
			<div className={common.container}>
				<div className={this.props.profileDialog ? styles.profileDialog : styles.profile}>
					<div className={styles.avatar} style={{backgroundColor: clientMe.colors.hex}}></div>

					<div className={styles.data}>
						<p className={styles.hello}>
							Hello <span className={styles.name} style={{color: clientMe.colors.hex}}>Mr. {clientMe.colors.name}</span>
						</p>

						<p className={styles.prop}>
							Your ID: <span className={styles.value}>Uj5CRqZ5b_Xubx9sAAAA</span>
						</p>

						<p className={styles.prop}>
							Your geoposition: <span className={styles.value}>{clientMe.coords.latitude}, {clientMe.coords.longitude}</span>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
