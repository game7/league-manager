import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import File from './file';
import Data from './data';
import Columns from './columns';

class Layout extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h1 className="page-header">Import</h1>
        {this.props.children}
      </div>
    );
  }
}

const routes = (
  <Route path="import" component={Layout}>
    <IndexRoute component={File}/>
    <Route path="data" component={Data}/>
    <Route path="columns" component={Columns}/>
  </Route>
);

export default routes;
