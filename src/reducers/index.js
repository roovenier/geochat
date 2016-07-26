import { combineReducers } from 'redux';
import clients from './clients';
import messages from './messages';
import notifications from './notifications';

const geochatApp = combineReducers({
	clients,
	messages,
	notifications
});

export default geochatApp;
