import React, { Component } from 'react';
import { connect } from 'react-redux';

class Wrapper extends Component {
	render() {
		return (
			<div>
				<h1>this is wrapper</h1>

				{this.props.children}
			</div>
		);
	}
}

function select(state) {
	return {};
}

export default connect(select)(Wrapper);
