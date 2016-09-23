import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import Show from './show';

const Layout = (props: { children?: JSX.Element[] }) => (
  <div>{props.children}</div>
)

const routes = (
  <Route path="leagues" component={Layout}>
    <IndexRoute component={Show}/>
    <Route path=":programId(/seasons/:seasonId)" component={Show}/>
  </Route>
);

export default routes;
