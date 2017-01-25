import * as React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './containers/App';
import Login from './containers/Login';

export default () => (
  <Route path="/" component={App}>
    <IndexRedirect to="login" />
    <Route path="login" component={Login} />
  </Route>
);
