import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import Context from './context';
import File from './file';
import Data from './data';
import Columns from './columns';
import Mapping from './mapping';
import Review from './review';

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
  <Route path="import" component={Layout}>
    <IndexRoute component={Context}/>
    <Route path="file" component={File}/>
    <Route path="data" component={Data}/>
    <Route path="columns" component={Columns}/>
    <Route path="mapping" component={Mapping}/>
    <Route path="review" component={Review}/>
  </Route>
);

export default routes;
