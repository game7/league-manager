import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Header, row, storage } from './common';

const delimiters = [',', '|', '\t'];

export function findDelimiter(content: string): string {
  return delimiters.filter(d => content.indexOf(d) !== -1)[0];
}

export function makeRows(content: string, delimiter: string): row[] {
  return content.replace(/\r/g,'').split('\n').filter(row => row != '').map(row => row.split(delimiter));
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
    storage.save(this.state)
  }

  handleHeaderRowChange = (event) => {
    this.setState({
      hasHeader: event.target.checked,
      teamMaps: undefined,
      locationMaps: undefined
    }, () => storage.save(this.state))
  }

  get canMoveNext(): boolean {
    return !!this.state.rows;
  }

  render() {
    return (
      <div>
        <Header
          title="File"
          canBack={true}
          backUrl="/games/import/file"
          canNext={this.canMoveNext}
          nextUrl="/games/import/columns"
        />
        <div className="form-group">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.hasHeader} onChange={this.handleHeaderRowChange}></input>
              Has Header Row
            </label>
          </div>
        </div>
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
      <TableHeader data={header}/>
      <tbody>
        {rows.map((row, i) => <Row data={row} key={i}/>)}
      </tbody>
    </table>
  )
};

const TableHeader = ({data}) => (
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
