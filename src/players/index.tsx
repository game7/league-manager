import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import List from './list';
import { default as importRoutes } from './import';

class Layout extends React.Component<any, any> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const routes = (
  <Route path="players" component={Layout}>
    <IndexRoute component={List}/>
    {importRoutes}
  </Route>
);

export default routes;
