import React, { Component } from 'react';
import { Link } from 'react-router';
import common from '../common.styl';
import styles from './styles.styl';
import Interlocutor from '../Interlocutor/Interlocutor';
import DialogMsg from '../DialogMsg/DialogMsg';
import DialogForm from '../DialogForm/DialogForm';

import $ from 'jquery';
require("jquery-mousewheel")($);
require('malihu-custom-scrollbar-plugin')($);

export default class DialogPage extends Component {
	render() {
		const { interlocutor, clientMe, messages, distance } = this.props;

		return (
			<div className={common.containerFlex}>
				<div className={styles.dialog}>
					<div>
						<Link className={styles.back} to='/'>Back</Link>

						<Interlocutor interlocutor={interlocutor} distance={distance} />
					</div>

					<div className={styles.messages} ref="messages">
						<div>
							{messages[interlocutor.id] && messages[interlocutor.id].map(item => {
								const date = new Date(item.date * 1000);
								const client = (item.sender === interlocutor.id) ? interlocutor : clientMe;

								return <DialogMsg key={item.id} date={date} item={item} client={client} />;
							})}
						</div>
					</div>

					<DialogForm keyDown={e => this.keyDown(e)} sendMessage={text => this.props.sendMessage(text)} />
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.setScrollbar();
	}

	componentDidUpdate() {
		this.setScrollbar();
	}

	setScrollbar() {
		$(this.refs.messages).mCustomScrollbar({
			theme: 'dark',
			keyboard: { enable: false }
		});

		$(this.refs.messages).mCustomScrollbar("scrollTo", 'bottom', {
			scrollInertia: 300
		});
	}
}
