import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import Wrapper from './containers/Wrapper';
import Clients from './containers/Clients';
import Dialog from './containers/Dialog';
import geochatApp from './reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(geochatApp);

render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path='/' component={Wrapper}>
				<IndexRoute component={Clients} />
				<Route path="/dialog/:clientId" component={Dialog} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
