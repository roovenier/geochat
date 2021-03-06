import React from 'react';
import common from '../common.styl';
import styles from './styles.styl';

const Profile = ({ clientMe, profileDialog }) => {
	return (
		<div className={common.container}>
			<div className={profileDialog ? styles.profileDialog : styles.profile}>
				<div className={styles.avatar} style={{backgroundColor: clientMe.colors.hex}}></div>

				<div className={styles.data}>
					<p className={styles.hello}>
						Hello <span className={styles.name} style={{color: clientMe.colors.hex}}>Mr. {clientMe.colors.name}</span>
					</p>

					<p className={styles.prop}>
						Your ID: <span className={styles.value}>{clientMe.id}</span>
					</p>

					<p className={styles.prop}>
						Your geoposition: <span className={styles.value}>{clientMe.coords.latitude}, {clientMe.coords.longitude}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
