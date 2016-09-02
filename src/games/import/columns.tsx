import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Back, Next, row, storage, Column, PROPERTIES } from './common';

export function makeColumns(row: row): Column[] {
  return row.map(col => {
    return {
      pattern: col
    }
  }) as Column[];
}

export default class Data extends Component<{},IImportState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    if(!this.state.columns) {
      this.state.columns = makeColumns(this.state.rows[0])
    }
  }

  get canMoveNext(): boolean {
    const columns = (this.state.columns || []);
    const columnCount = columns.length;
    const mappedCount = columns.filter(col => !!col.property).length;
    return columnCount == 0 || columnCount !== mappedCount;
  }

  handleColumnChange = (key: string) => (event: any) => {
    const value = event.target.value;
    const state = Object.assign({}, this.state);
    const columns = state.columns.map((column, i) => {
      if (column.pattern == key) {
        column.property = value;
      }
      return column;
    })
    this.setState({ columns: columns }, () => storage.save(this.state));
  }

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
    console.log('render', new Date())
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {this.state.columns.map((col) => (
              <Row column={col} key={col.pattern} onChange={this.handleColumnChange}/>
            ))}
          </tbody>
        </table>
        <hr/>
        <Back to="/games/import/data"/>
        {" "}
        <Next
          disabled={this.canMoveNext}
          to="/games/import/columns"/>
        <hr/>
        <pre>{JSON.stringify(this.state.columns, null, 2)}</pre>
      </div>
    );
  }
}

let Row = ({column, onChange}) => (
  <tr>
    <td>{column.pattern}</td>
    <td>
      <select className="form-control" value={column.property} onChange={onChange(column.pattern)}>
        <option value=""></option>
        {PROPERTIES.map(prop => <option value={prop}>{prop}</option>)}
      </select>
    </td>
  </tr>
)
