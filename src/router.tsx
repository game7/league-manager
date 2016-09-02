import * as React from 'react';
import { Router, Route, IndexRoute,
         IndexRedirect, browserHistory,
         hashHistory} from 'react-router';

import App from './app';
import { default as games } from './games';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/games" />    
      {games}
    </Route>
  </Router>
);
