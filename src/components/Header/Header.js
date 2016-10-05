import React from 'react';
import { Link } from 'react-router';
import common from '../common.styl';
import styles from './styles.styl';

const Header = () => {
	return (
		<div className={styles.header}>
			<div className={common.container}>
				<Link className={styles.logo} to={'/'}>Geochat</Link>
			</div>
		</div>
	);
};

export default Header;
