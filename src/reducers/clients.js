import { SET_CLIENTS, SET_CLIENT_ME } from '../actions/clients';

const defaultState = {
	clientList: [],
	clientMe: {}
};

export default function clients(state = defaultState, action) {
	switch (action.type) {
		case SET_CLIENTS:
			return { ...state, clientList: [...action.clients].reverse() }
		case SET_CLIENT_ME:
			return { ...state, clientMe: action.clientMe }
		default:
			return state;
	}
}
