import * as React from 'react';
import { Router, Route, IndexRoute,
         IndexRedirect, browserHistory,
         hashHistory} from 'react-router';

import App from './app';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
);
