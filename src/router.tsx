import * as React from 'react';
import { Router, Route, IndexRoute,
         IndexRedirect, browserHistory,
         hashHistory} from 'react-router';

import App from './app';
import { default as games } from './games';
import { default as leagues } from './leagues';
import { default as players } from './players';

export default () => (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/games" />
      {games}
      {players}
      {leagues}
    </Route>
  </Router>
);
