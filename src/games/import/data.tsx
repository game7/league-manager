import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Back, Next, row, storage } from './common';

const delimiters = [',', '|', '\t'];

export function findDelimiter(content: string): string {
  return delimiters.filter(d => content.indexOf(d) !== -1)[0];
}

export function makeRows(content: string, delimiter: string): row[] {
  return content.replace('\r','').split('\n').map(row => row.split(delimiter));
}

export default class Data extends Component<{},IImportState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    if(!this.state.delimiter) {
      this.state.delimiter = findDelimiter(this.state.file.content);
    }
    if(!this.state.rows) {
      this.state.rows = makeRows(this.state.file.content, this.state.delimiter);
    }
  }

  handleHeaderRowChange = (event) => {
    this.setState({
      hasHeader: event.target.checked
    }, () => storage.save(this.state))
  }

  get canMoveNext(): boolean {
    return !this.state.rows;
  }
  //
  // handleColumnChange = (key: string) => (event: any) => {
  //   const value = event.target.value;
  //   const state = Object.assign({}, this.state);
  //   const columns = state.columns.map((column, i) => {
  //     if (column.key == key) {
  //       column.value = value;
  //       this.prepareColumnLookups(key, i);
  //     }
  //     return column;
  //   })
  //   this.setState({ columns: columns });
  // }
  //
  // prepareColumnLookups = (property: string, index: number) => {
  //   switch(property) {
  //     case 'Home Team':
  //     case 'Away Team':
  //
  //       break;
  //     case 'Location':
  //       this.prepareLocationLookups(index);
  //       break;
  //   }
  // }
  //
  // prepareLocationLookups = (index: number) => {
  //   const rows = this.state.rows;
  //   const all = rows.map(row => row[index]);
  //   const uniq = _.uniq(all) as string[];
  //   const locations = uniq.map(item => ({ key: item }));
  //   this.setState({ locations: locations });
  // }

  render() {
    return (
      <div>
        <div className="form-group">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.hasHeader} onChange={this.handleHeaderRowChange}></input>
              Has Header Row
            </label>
          </div>
        </div>
        <hr/>
        <Back to="/games/import"/>
        {" "}
        <Next
          disabled={this.canMoveNext}
          to="/games/import/columns"/>
        <hr/>
        <Rows data={this.state.rows} hasHeader={this.state.hasHeader}/>
      </div>
    );
  }
}

//const Rows = ({data}) => <pre>{JSON.stringify(data, null, 2)}</pre>

const Rows = ({data, hasHeader}) => {
  let rows = [...data];
  let header = hasHeader ? rows.splice(0, 1) : [];
  return (
    <table className="table table-bordered">
      <Header data={header}/>
      <tbody>
        {rows.map((row, i) => <Row data={row} key={i}/>)}
      </tbody>
    </table>
  )
};

const Header = ({data}) => (
  <thead>
    {data.map((row, i) => <HeaderRow data={row} key={i}/>)}
  </thead>
)

const HeaderRow = ({data}) => (
  <tr>
    {data.map((column, i) => <HeaderColumn data={column} key={i}/>)}
  </tr>
);

const HeaderColumn = ({data}) => <th>{data}</th>;

const Row = ({data}) => (
  <tr>
    {data.map((column, i) => <Column data={column} key={i}/>)}
  </tr>
);

const Column = ({data}) => <td>{data}</td>;
