import * as React from 'react';
import ReactDOM from 'react-dom';
// noinspection JSUnresolvedVariable
import { Router, browserHistory } from 'react-router';
// noinspection JSUnresolvedVariable
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './redux/store';
import createRoutes from './routes';

function makeApp(initialState) {
  const routes = createRoutes();
  // noinspection JSUnresolvedVariable
  const store = configureStore(initialState, browserHistory);
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>
  );
}

// noinspection JSUnresolvedVariable
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  // Browser environment
  // noinspection JSUnresolvedVariable
  ReactDOM.render(makeApp(window.__INITIAL_STATE__), document.getElementById('app'));
}

export default makeApp;
