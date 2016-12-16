import * as React from 'react';
import 'whatwg-fetch';

class App extends React.Component<any, any> {
  render() {
    return (
      <div className="app container">
        {this.props.children}
      </div>
    );
  }
}

export default App;
